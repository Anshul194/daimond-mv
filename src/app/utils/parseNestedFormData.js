// Utility to parse FormData (parseNestedFormData.js)
export function parseNestedFormData(formData) {
  const data = {};

  for (const [key, value] of formData.entries()) {
    // Handle array notation like terms[0][value]
    if (key.includes('[') && key.includes(']')) {
      const matches = key.match(/^(\w+)\[(\d+)\]\[(\w+)\]$/);
      if (matches) {
        const [, arrayName, index, fieldName] = matches;

        if (!data[arrayName]) {
          data[arrayName] = [];
        }

        if (!data[arrayName][index]) {
          data[arrayName][index] = {};
        }

        // Handle file uploads
        if (typeof value === 'object' && value !== null && value.name) {
          // If it's an empty file from a form submit, you might want to skip or make it empty string
          if (value.size === 0) {
            data[arrayName][index][fieldName] = '';
          } else {
            data[arrayName][index][fieldName] = value;
          }
        } else {
          data[arrayName][index][fieldName] = value;
        }
      } else {
        // Handle other bracket notation if needed
        data[key] = value;
      }
    }
    // Handle JSON string in terms field
    else if (key === 'terms') {
      try {
        data[key] = JSON.parse(value);
      } catch (e) {
        data[key] = [];
      }
    }
    // Handle regular fields
    else {
      // Handle file uploads
      if (typeof value === 'object' && value !== null && value.name) {
        if (value.size === 0) {
          data[key] = '';
        } else {
          data[key] = value;
        }
      } else {
        data[key] = value;
      }
    }
  }

  return data;
}