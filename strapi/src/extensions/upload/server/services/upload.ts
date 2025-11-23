import { v2 as cloudinary } from "cloudinary";
import type { Core } from "@strapi/strapi";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
    async upload(file) {

        // Strapi v5 – read plugin config correctly
        const uploadPlugin = strapi.config.get("plugin.upload") as {
            provider?: string;
            providerOptions?: any;
            actionOptions?: any;
        };

        if (!uploadPlugin?.providerOptions) {
            throw new Error("Cloudinary providerOptions missing in config/plugins.ts");
        }

        const providerOptions = uploadPlugin.providerOptions;

        cloudinary.config({
            cloud_name: providerOptions.cloud_name,
            api_key: providerOptions.api_key,
            api_secret: providerOptions.api_secret,
        });

        const result = await cloudinary.uploader.upload(file.tmpPath, {
            folder: providerOptions.folder || "strapi",
            resource_type: "image",
        });

        // Required for Strapi
        file.url = result.secure_url;

        // Required for checkbox to show
        file.previewUrl = result.secure_url;

        // Required for Media Library thumbnail
        file.formats = {
            thumbnail: {
                url: cloudinary.url(result.public_id, {
                    width: 200,
                    height: 200,
                    crop: "fill",
                    secure: true,
                }),
                width: 200,
                height: 200,
                name: "thumbnail",
                hash: `${result.public_id}_thumb`,
                ext: file.ext,
                mime: file.mime,
                size: file.size,
                path: null,
            },
        };

        // Required for delete/reuse
        file.provider = "cloudinary";
        file.provider_metadata = {
            public_id: result.public_id,
            resource_type: result.resource_type,
        };

        file.url = result.secure_url;
        file.previewUrl = result.secure_url;

        file.ext = file.ext || `.${result.format}`;
        file.mime = file.mime || `image/${result.format}`;
        file.storage = "cloud";
        return file;
    },

    async delete(file) {
        if (file.provider_metadata?.public_id) {
            await cloudinary.uploader.destroy(
                file.provider_metadata.public_id,
                { resource_type: "image" }
            );
        }
    },
});
