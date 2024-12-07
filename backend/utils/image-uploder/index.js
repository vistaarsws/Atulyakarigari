import { v2 as cloudinary } from 'cloudinary';
export const uploadImageToCloudinary = async (file, folder, height, quality) => {
    try {
        const options = { folder }
        if (height) {
            options.height = height
        }
        if (quality) {
            options.quality = quality
        }
        options.resource_type = "auto"
        return await cloudinary.uploader.upload(file.tempFilePath, options)
    } catch (err) {
        console.log(`not able to upload file on cloudinary ${err}`)
    }
}

export const deleteImageFromCloudinary = async (publicId) => {
    try {
        // Attempt to delete the image using the provided public ID
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === "ok") {
            return { status: "success", publicId };
        } else {
            console.error(`Failed to delete image with ID: ${publicId}. Reason: ${result.result}`);
            return { status: "failed", publicId, reason: result.result };
        }
    } catch (err) {
        console.error(`Error deleting image with ID: ${publicId}. Error: ${err.message}`);
        return { status: "error", publicId, reason: err.message };
    }
};

