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
import type * as kcal_record from "../kcal_record.js";
import type * as personal from "../personal.js";
import type * as recipe from "../recipe.js";
import type * as sample_menu from "../sample_menu.js";
import type * as t_list_manage from "../t_list_manage.js";
import type * as t_menu from "../t_menu.js";
import type * as training_log from "../training_log.js";
import type * as training_records from "../training_records.js";
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
  kcal_record: typeof kcal_record;
  personal: typeof personal;
  recipe: typeof recipe;
  sample_menu: typeof sample_menu;
  t_list_manage: typeof t_list_manage;
  t_menu: typeof t_menu;
  training_log: typeof training_log;
  training_records: typeof training_records;
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
