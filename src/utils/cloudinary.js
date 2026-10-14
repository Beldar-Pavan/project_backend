import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFileUrl) => {
    try {
        if (!localFileUrl) return null;

        const response = await cloudinary.uploader.upload(localFileUrl, {
            resource_type: "auto"
        });

        console.log("File is uploaded on Cloudinary, check the URL and the browser: ", response.url);

        if (fs.existsSync(localFileUrl)) {
            fs.unlinkSync(localFileUrl);
        }

        return response;

    } catch (error) {
        if (localFileUrl && fs.existsSync(localFileUrl)) {
            fs.unlinkSync(localFileUrl);
        }

        console.log("Cloudinary upload error, check the your image url: ", error);

        return null;
    }
};

export { uploadOnCloudinary };