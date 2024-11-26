// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
// });

// const uploadImageCloudinary = async (image) => {
//   const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());

//   const uploadImage = await new Promise((resolve, reject) => {
//     cloudinary.uploader
//       .upload_stream({ folder: "binkeyit" }, (error, uploadResult) => {
//         return resolve(uploadResult);
//       })
//       .end(buffer);
//   });

//   return uploadImage;
// };

// export default uploadImageCloudinary;

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const uploadImageCloudinary = async (image) => {
  // Check if image is defined and has a valid buffer
  if (!image) {
    throw new Error("No image provided for upload");
  }

  // Determine whether image is a Buffer or needs to be converted from arrayBuffer
  let buffer;
  if (image.buffer) {
    buffer = image.buffer; // If image has a buffer, use it directly
  } else if (image.arrayBuffer) {
    buffer = Buffer.from(await image.arrayBuffer()); // Otherwise, convert from arrayBuffer
  } else {
    throw new Error("Image does not have a valid buffer or arrayBuffer");
  }

  // Upload the image to Cloudinary
  const uploadImage = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "Swiftly" }, (error, uploadResult) => {
        if (error) {
          return reject(error); // Handle the error properly
        }
        resolve(uploadResult);
      })
      .end(buffer);
  });

  return uploadImage;
};

export default uploadImageCloudinary;
