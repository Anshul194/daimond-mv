import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    // Await params if it's a promise (standard in newer Next.js versions)
    const { path: pathSegments } = await params;
    
    // Construct the full path to the file in the public directory
    const filePath = path.join(process.cwd(), "public", ...pathSegments);

    const file = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    
    // Map common extensions to MIME types
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.mov': 'video/quicktime',
    };

    return new NextResponse(file, {
      headers: {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Cache-Control': 'no-store, must-revalidate', // Key: bypass any caching
      },
    });
  } catch (error) {
    console.error("Dynamic image serving error:", error.message);
    return new NextResponse("File not found", { status: 404 });
  }
}
