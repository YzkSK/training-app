import { httpRouter } from "convex/server";
import { internal } from "./_generated/api"; // Add this import
import { httpAction } from "./_generated/server";

const http = httpRouter();

export const doSomething = httpAction(async (ctx, request) => {
    const { data, type } = await request.json();

    switch (type) {
        case 'user.created':
            await ctx.runMutation(internal.users.create, {
                clerkId: data.id,
                email: data.email_addresses[0].email_address,
                username: data.username,
            });
            break;
        case 'user.updated':
            console.log("User updated:", data);
            break;
        case 'user.deleted':
            console.log("User deleted:", data);
            break;
    }

  return new Response();
});

http.route({
    path: "/clerk-users-webhook",
    method: "POST",
    handler: doSomething,
})

export default http;
