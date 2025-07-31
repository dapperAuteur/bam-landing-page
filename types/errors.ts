export interface AppError extends Error {
  // You can add other common properties here if your application errors
  // often have them, e.g.:
  code?: string | number;
  // details?: unknown;
}