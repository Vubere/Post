const jsend = (
  status: string,
  data?: any,
  message?: string,
  extra?: Record<any, any>
) => {
  return {
    status,
    ...(data ? { data } : {}),
    ...(message ? { message } : {}),
    ...(extra ? extra : {}),
  };
};

const STATUS = {
  success: "success!",
  error: "error",
};
export { jsend, STATUS };
