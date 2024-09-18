const jsend = (
  status: string,
  data?: any,
  message?: string,
  extra?: Record<any, any>
) => {
  return {
    status,
    ...(data ? { data: data } : {}),
    ...(message ? { message } : {}),
    ...(extra ? extra : {}),
  };
};

function validateObjectKeys(
  receivedKeys: Array<string>,
  intendedKeys: Array<string>,
  shouldMatchLength?: boolean
) {
  if (shouldMatchLength && receivedKeys.length !== intendedKeys.length)
    return false;
  for (let value of receivedKeys) {
    if (!intendedKeys.includes(value)) return false;
  }
  return true;
}

const STATUS = {
  success: "success",
  error: "error",
};

const UPDATEABLE_USER_DATA = [
  "firstName",
  "lastName",
  "username",
  "email",
  "profilePhoto",
  "coverPhoto",
  "biography",
  "profession",
  "sections",
  "interest",
  "dateOfBirth",
];
const UPDATEABLE_BLOG_DATA = [
  "title",
  "synopsis",
  "content",
  "coverPhoto",
  "notifications",
  "paywalls",
  "paywalledUsers",
  "userAccess",
];
const UPDATABLE_COMMENT_DATA = ["content"];
const STATUS_CODES = {
  informational: {
    Continue: 100,
    Switching_Protocols: 101,
    Processing: 102,
    Early_Hints: 103,
  },
  success: {
    OK: 200,
    Created: 201,
    Accepted: 202,
    Non_Authoritative_Information: 203,
    No_Content: 204,
    Reset_Content: 205,
    Partial_Content: 206,
    Multi_Status: 207,
    Already_Reported: 208,
    IM_Used: 226,
  },
  redirection: {
    Multiple_Choices: 300,
    Moved_Permanently: 301,
    Found: 302,
    See_Other: 303,
    Not_Modified: 304,
    Use_Proxy: 305,
    Switch_Proxy: 306,
    Temporary_Redirect: 307,
    Permanent_Redirect: 308,
  },
  clientError: {
    Bad_Request: 400,
    Unauthorized: 401,
    Payment_Required: 402,
    Forbidden: 403,
    Not_Found: 404,
    Method_Not_Allowed: 405,
    Not_Acceptable: 406,
    Proxy_Authentication_Required: 407,
    Request_Timeout: 408,
    Conflict: 409,
    Gone: 410,
    Length_Required: 411,
    Precondition_Failed: 412,
    Payload_Too_Large: 413,
    URI_Too_Long: 414,
    Unsupported_Media_Type: 415,
    Range_Not_Satisfiable: 416,
    Expectation_Failed: 417,
    Im_a_teapot: 418, // RFC 2324
    Misdirected_Request: 421,
    Unprocessable_Entity: 422,
    Locked: 423,
    Failed_Dependency: 424,
    Too_Early: 425,
    Upgrade_Required: 426,
    Precondition_Required: 428,
    Too_Many_Requests: 429,
    Request_Header_Fields_Too_Large: 431,
    Unavailable_For_Legal_Reasons: 451,
  },
  serverError: {
    Internal_Server_Error: 500,
    Not_Implemented: 501,
    Bad_Gateway: 502,
    Service_Unavailable: 503,
    Gateway_Timeout: 504,
    HTTP_Version_Not_Supported: 505,
    Variant_Also_Negotiates: 506,
    Insufficient_Storage: 507,
    Loop_Detected: 508,
    Not_Extended: 510,
    Network_Authentication_Required: 511,
  },
};

export {
  jsend,
  validateObjectKeys,
  STATUS,
  UPDATEABLE_USER_DATA,
  UPDATEABLE_BLOG_DATA,
  UPDATABLE_COMMENT_DATA,
  STATUS_CODES,
};
