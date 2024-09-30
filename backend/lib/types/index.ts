import { Request } from "express";

interface CustomError extends Error {
  statusCode?: number;
  status?: string;
}
interface UserConfirmRequest extends Request {
  user?: any;
  requesterId?: string;
}
interface NotificationConfirmRequest extends Request {
  notification?: any;
  requesterId?: string;
}
interface PostConfirmRequest extends Request {
  post?: any;
  requesterId?: string;
}
interface CommentConfirmRequest extends Request {
  post?: any;
  comment?: any;
  requesterId?: string;
}
export {
  CustomError,
  UserConfirmRequest,
  NotificationConfirmRequest,
  PostConfirmRequest,
  CommentConfirmRequest,
};
