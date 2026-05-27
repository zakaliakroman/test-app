import { HttpStatusCode } from "./enums/http-status.enum";

export type ServiceErrorCode = "NOT_FOUND" | "LIMIT_EXCEEDED" | "INTERNAL";

export interface ServiceError {
  code: HttpStatusCode;
  message: string;
}
