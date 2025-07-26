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
import type * as bw_training from "../bw_training.js";
import type * as http from "../http.js";
import type * as personal from "../personal.js";
import type * as recipe from "../recipe.js";
import type * as t_menu from "../t_menu.js";
import type * as t_playlist from "../t_list_manage.js";
import type * as users from "../users.js";
import type * as w_training from "../w_training.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  bw_training: typeof bw_training;
  http: typeof http;
  personal: typeof personal;
  recipe: typeof recipe;
  t_menu: typeof t_menu;
  t_playlist: typeof t_playlist;
  users: typeof users;
  w_training: typeof w_training;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
