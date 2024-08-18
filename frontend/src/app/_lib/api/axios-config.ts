import { GetState } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios from "axios";
import type { AxiosRequestConfig, AxiosError, AxiosHeaders } from "axios";
import { toast } from "react-toastify";

const axiosBaseQuery =
  (
    {
      baseUrl,
      prepareHeaders,
    }: {
      baseUrl: string;
      prepareHeaders?: (
        headers: any,
        state: { getState: GetState<any> }
      ) => any;
    } = { baseUrl: "" }
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      body?: any;
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, body, params, headers }) => {
    try {
      if (prepareHeaders && headers !== undefined) {
        /* headers = prepareHeaders(headers, {
          getState,
        }); */
      }
      const result = await axios({
        url: baseUrl + url,
        method,
        data: body || data,
        params,
        headers,
      });
      if (result.data?.error && result.config.method !== "get") {
        toast.error("an error occured, check your internet and try again!");
        return { data: null };
      }
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      if (err && err?.config?.method !== "get") {
        switch (err.code || "ERR_NETWORK") {
          case "ERR_NETWORK": {
            toast.error(
              "unable to connect with the server, check your internet connection and try again!"
            );
            break;
          }
          default: {
            toast.error("an error occured!");
          }
        }
      }
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
export default axiosBaseQuery;
