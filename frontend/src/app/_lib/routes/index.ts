export enum ROUTES {
  login = "/login",
  signup = "/sign-up",
  home = "/",
  about = "#about",
  forgotPassword = "/forgot-password",
  resetPassword = "/reset-password",
  setup = "/set-up",
  dashboard = "/feed",
  settings = "/settings",
  notifications = "/notifications",
  bookmarks = "/bookmarks",
  drafts = "/drafts",
  analytics = "/analytics",
  account = "/account",
  accountEdit = ROUTES.account + "/edit",
  accountId = ROUTES.account + "/:id",
  scribe = "/scribe",
  scribeId = ROUTES.scribe + "/:id",
  post = "/post",
  postId = ROUTES.post + "/:id",
  connect = "/connect",
  following = "/following/:id",
  followers = "/followers/:id",
}
