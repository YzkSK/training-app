import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/clerk-sdk-node";

// Webhookの署名を検証するための秘密鍵
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;

export const handle = httpAction(async (ctx, request) => {
    const payload = await request.text();
    const svixHeaders = {
        "svix-id": request.headers.get("svix-id")!,
        "svix-timestamp": request.headers.get("svix-timestamp")!,
        "svix-signature": request.headers.get("svix-signature")!,
    };

    // SvixのWebhookを使ってリクエストを検証
    const wh = new Webhook(webhookSecret);
    let event: WebhookEvent;
    try {
        event = wh.verify(payload, svixHeaders) as WebhookEvent;
    } catch (err) {
        console.error("Webhook verification failed:", err);
        return new Response("Error occurred", { status: 400 });
    }

    // イベントの種類に応じて処理を分岐
    switch (event.type) {
        case "user.created":
        case "user.updated": {
            const emailObject = event.data.email_addresses?.find(
                email => email.id === event.data.primary_email_address_id
            );
            if (!emailObject) {
                console.warn("Primary email not found for user", event.data.id);
                break;
            }
            await ctx.runMutation(internal.users.store, {
                clerkId: event.data.id,
                username: event.data.username!,
                email: emailObject.email_address,
            });
            break;
        }
        case "user.deleted": {
            // 必要であればユーザー削除の処理をここに書く
            // const clerkId = event.data.id!;
            // await ctx.runMutation(internal.users.delete, { clerkId });
            break;
        }
    }

    return new Response(null, { status: 200 });
});