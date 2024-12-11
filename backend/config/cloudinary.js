import { v2 as cloudinary } from 'cloudinary';

const cloudinaryConnect = () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET,
        });
        

    } catch (err) {
        console.log(`unable to connect in cloudinary ${err}`);
    }
};
export default cloudinaryConnect;