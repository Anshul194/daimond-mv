/**
 * Builds a full absolute URL for an image path stored in the database.
 *
 * The backend saves uploaded images as relative paths like `/products/filename.jpg`.
 * In development these resolve fine against localhost:3000.
 * In production we prefix them with NEXT_PUBLIC_BASE_URL so they point
 * to the correct backend server that actually serves the files.
 *
 * Usage:
 *   import { getImageUrl } from "@/utils/image";
 *   <img src={getImageUrl(product.image[0])} />
 */
const BASE_URL =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_BASE_URL) ||
    "http://localhost:3000";

/**
 * @param {string|null|undefined} path - relative or absolute image path
 * @returns {string} - fully-qualified image URL
 */
export function getImageUrl(path) {
    if (!path) return "";
    // Already an absolute URL (http/https/data) — return as-is
    if (/^(https?:\/\/|data:)/.test(path)) return path;
    // Relative path — prefix with backend base URL
    const base = BASE_URL.replace(/\/$/, ""); // remove trailing slash
    return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * Returns the first image URL of a product's image array.
 * @param {string[]} images
 * @returns {string}
 */
export function getFirstImage(images) {
    if (!Array.isArray(images) || images.length === 0) return "";
    return getImageUrl(images[0]);
}
