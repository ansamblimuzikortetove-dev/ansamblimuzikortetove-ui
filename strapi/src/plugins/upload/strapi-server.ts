import type { Core } from "@strapi/strapi";

export default (plugin: Core.Plugin) => {
    console.log("✅ Custom Upload plugin Cloudinary asset patch active");

    // keep reference so we can call it later
    const originalBootstrap = plugin.bootstrap;

    // use `any` for the argument to satisfy TS but allow runtime call with no args
    plugin.bootstrap = async (args?: any) => {
        try {
            if (originalBootstrap) {
                // pass an empty object if Strapi doesn’t send one
                await originalBootstrap(args ?? { strapi: (global as any).strapi });
            }

            const s = (global as any).strapi as Core.Strapi | undefined;
            if (!s) {
                console.warn("⚠️ Global Strapi instance not found — skipping Cloudinary patch");
                return;
            }

            const uploadCtrl: any = s.plugin("upload")?.controller("upload");
            if (uploadCtrl && typeof uploadCtrl.find === "function") {
                const originalFind = uploadCtrl.find;

                uploadCtrl.find = async (ctx: any, next?: any) => {
                    ctx.query = {
                        ...ctx.query,
                        filters: {}, // include Cloudinary assets in Add-asset modal
                    };

                    return await originalFind(ctx, next);
                };

                console.log("✅ Cloudinary asset reuse patch applied successfully");
            } else {
                console.warn("⚠️ Upload controller not found — patch skipped");
            }
        } catch (err) {
            console.error("❌ Error applying Cloudinary asset patch:", err);
        }
    };

    return plugin;
};
