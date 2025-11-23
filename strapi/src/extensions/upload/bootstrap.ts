export default async () => {
    const uploadService = strapi.plugin('upload').service('upload');
    const originalUpload = uploadService.upload;

    // Monkey-patch the upload service to set a previewUrl
    uploadService.upload = async function (files) {
        const uploaded = await originalUpload.call(this, files);

        if (Array.isArray(uploaded)) {
            uploaded.forEach((file) => {
                if (file.url && !file.previewUrl) {
                    file.previewUrl = file.url.replace(
                        '/upload/',
                        '/upload/w_200,h_200,c_fill/'
                    );
                }
            });
        }
        return uploaded;
    };
};
