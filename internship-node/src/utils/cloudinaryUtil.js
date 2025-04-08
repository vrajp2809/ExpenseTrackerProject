const cloudinary = require("cloudinary").v2;

const uploadFileToCloudinary = async(file) =>{

    cloudinary.config({
        cloud_name:"dyrnzrank",
        api_key:"595317851325132",
        api_secret:"UjMn2emS5emdAzkzdim0L-TWvUo"
    })

    const cloudinaryResponse = await cloudinary.uploader.upload(file.path);
    return cloudinaryResponse;

};

cloudinary.config({
    cloud_name: "dyrnzrank",
    api_key: "595317851325132",
    api_secret: "UjMn2emS5emdAzkzdim0L-TWvUo"
});

const uploadUpdateFileToCloudinary = async (file) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        uploadStream.end(file.buffer); // Send image data from memory
    });
};




module.exports = {
    uploadFileToCloudinary,uploadUpdateFileToCloudinary
}