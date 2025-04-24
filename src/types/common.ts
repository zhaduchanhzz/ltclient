import { MODAL_MODE } from "@/consts";

export type ModalMode = (typeof MODAL_MODE)[keyof typeof MODAL_MODE];

/**
 * Defines the structure for pagination settings.
 *
 * Properties:
 * - `pageNumber`: An optional number representing the current page index.
 * - `pageSize`: An optional number specifying the number of items per page.
 */
export type Pagination = {
  pageNumber?: number;
  pageSize?: number;
};

/**
 * Defines the structure for a table column.
 *
 * Properties:
 * - `id`: A string or `null` representing the unique identifier of the column.
 * - `label`: A string or `null` specifying the column's display name.
 * - `minWidth`: An optional number or `null` defining the minimum width of the column.
 * - `minHeight`: An optional number or `null` defining the minimum height of the column.
 * - `align`: An optional alignment setting for the column content (`"right"`, `"center"`, or `"left"`).
 * - `sticky`: An optional boolean or `null` indicating whether the column should remain fixed during scrolling.
 * - `stickyPosition`: An optional position (`"right"` or `"left"`) specifying where a sticky column should be fixed.
 * - `zIndex`: An optional number defining the stacking order for sticky columns.
 * - `format`: An optional function or `null` that formats numeric values within the column.
 */
export type Column = {
  id: string | null;
  label: string | null;
  minWidth?: number | null;
  minHeight?: number | null;
  align?: "right" | "center" | "left";
  sticky?: boolean | null;
  stickyPosition?: ("right" | "left") | null;
  zIndex?: number;
  format?: ((value: number) => string) | null;
};

export type CommonResponse<T> = {
  code: number;
  message: string;
  timestamp: string;
  success: boolean;
  data: T;
};
