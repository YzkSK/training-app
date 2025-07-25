/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as f_data from "../f_data.js";
import type * as login_users from "../login/users.js";
import type * as p_data from "../p_data.js";
import type * as schema from "../schema.js";
import type * as t_data from "../t_data.js";
import type * as t_video from "../t_video.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  f_data: typeof f_data;
  "login/users": typeof login_users;
  p_data: typeof p_data;
  schema: typeof schema;
  t_data: typeof t_data;
  t_video: typeof t_video;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
