/**
 * Compresses an image file using the Canvas API.
 * @param {File} file - The original image file.
 * @param {number} quality - Compression quality (0 to 1).
 * @param {number} maxWidth - Maximum width of the image.
 * @returns {Promise<File>} - The compressed File object.
 */
export async function compressImage(file, quality = 0.7, maxWidth = 1500) {
  if (!file || !file.type.startsWith("image/")) return file;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Resize if wider than maxWidth
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      };
    };
  });
}
