import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // e.g. "mycloudname"
  api_key: process.env.CLOUDINARY_API_KEY, // e.g. "123456789012345"
  api_secret: process.env.CLOUDINARY_API_SECRET, // e.g. "mysecretkey"
});

export interface UploadResult {
  url: string;
  public_id: string;
}

/**
 * Upload an image file to Cloudinary.
 * @param filePath - The local path to the image file.
 * @returns A promise that resolves with the image URL and public_id.
 */
export async function uploadImage(filePath: string): Promise<UploadResult> {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "images", // optional: store images in an "images" folder
      resource_type: "image", // ensures the file is treated as an image
    });
    return { url: result.secure_url, public_id: result.public_id };
  } catch (error) {
    throw new Error(`Image upload failed: ${error}`);
  }
}

/**
 * Upload a PDF file to Cloudinary.
 * @param filePath - The local path to the PDF file.
 * @returns A promise that resolves with the PDF URL and public_id.
 */
export async function uploadPDF(filePath: string): Promise<UploadResult> {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "pdfs", // optional: store PDFs in a "pdfs" folder
      resource_type: "raw", // use "raw" to upload non-image files like PDFs
    });
    return { url: result.secure_url, public_id: result.public_id };
  } catch (error) {
    throw new Error(`PDF upload failed: ${error}`);
  }
}
