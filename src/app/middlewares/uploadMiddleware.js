export async function parseFormData(request) {
  try {
    const formData = await request.formData();
    const fields = {};
    const files = {};

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        files[key] = value;
      } else {
        fields[key] = value;
      }
    }

    return { fields, files };
  } catch (error) {
    throw new Error('Failed to parse form data: ' + error.message);
  }
}