import { STATUS_CODES } from ".";

class CustomError extends Error {
  statusCode: number = STATUS_CODES.serverError.Internal_Server_Error;
  status: string = "error";
  isOperational: Boolean = true;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode || this.statusCode;
    this.status =
      this.statusCode >= STATUS_CODES.clientError.Bad_Request &&
      this.statusCode < STATUS_CODES.serverError.Internal_Server_Error
        ? "failed"
        : this.status;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
