// Use relative path to avoid CORS issues in both dev and production
// export const HOST_API = import.meta.env.DEV ? "/api" : "/";
import config from "@/config/bera";

export const HOST_API = config.host_api;

export const INVATE_ACTIVE = false;
