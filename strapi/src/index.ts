import type { Core } from "@strapi/strapi";
import uploadPlugin from "./plugins/upload/strapi-server";

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    const upload = strapi.plugin("upload");
    if (upload) {
      uploadPlugin(upload);
    }
  },

  bootstrap() {},
};
