import { v2 as cloudinary } from "cloudinary";
import { Buffer } from "buffer";

// Configure Cloudinary using environment variables.
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
      folder: "images",
      resource_type: "image",
    });
    return { url: result.secure_url, public_id: result.public_id };
  } catch (error: any) {
    throw new Error(`Image upload failed: ${error.message || error}`);
  }
}

/**
 * Upload a PDF file to Cloudinary.
 * @param file - The File object to upload.
 * @returns A promise that resolves with the PDF URL and public_id.
 */
export async function uploadPDF(file: File): Promise<UploadResult> {
  try {
    // Convert the File (a Blob) to an ArrayBuffer, then to a Buffer.
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "pdfs",
          resource_type: "raw",
          format: "pdf",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
      stream.end(buffer);
    });

    let secure_url = result.secure_url;
    // If the secure URL doesn't end with ".pdf", append it.
    if (!secure_url.toLowerCase().endsWith(".pdf")) {
      secure_url += ".pdf";
    }
    return { url: secure_url, public_id: result.public_id };
  } catch (error: any) {
    throw new Error(`PDF upload failed: ${error.message || error}`);
  }
}
