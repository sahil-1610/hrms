import fetch from "node-fetch"; // For Node.js 18+, you can use the global fetch instead.
import pdfParse from "pdf-parse";

/**
 * Extracts text from a PDF file given its URL.
 * @param pdfUrl - The URL of the PDF file.
 * @returns A promise that resolves with the extracted text.
 */
export async function extractPdfText(pdfUrl: string): Promise<string> {
  // Fetch the PDF file from the URL.
  const response = await fetch(pdfUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch PDF: ${response.statusText}`);
  }

  // Convert the response into a Buffer.
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Parse the PDF buffer to extract text.
  const pdfData = await pdfParse(buffer);

  return pdfData.text;
}
