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
import type * as asignaturas from "../asignaturas.js";
import type * as cursos from "../cursos.js";
import type * as datosEjemplo from "../datosEjemplo.js";
import type * as datosPruebaProgreso from "../datosPruebaProgreso.js";
import type * as entregas from "../entregas.js";
import type * as limpiarDB from "../limpiarDB.js";
import type * as notes from "../notes.js";
import type * as usuarios from "../usuarios.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  asignaturas: typeof asignaturas;
  cursos: typeof cursos;
  datosEjemplo: typeof datosEjemplo;
  datosPruebaProgreso: typeof datosPruebaProgreso;
  entregas: typeof entregas;
  limpiarDB: typeof limpiarDB;
  notes: typeof notes;
  usuarios: typeof usuarios;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
