const mammoth = require('mammoth');
const Product = require('../../models/Product'); // Adjust this if your model is deeper

exports.bulkUploadProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await mammoth.extractRawText({ buffer: req.file.buffer });
    const text = result.value;

    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line);

    const products = lines.map((line) => {
      const [name, price, category, description] = line.split(',');
      return {
        name: name?.trim(),
        price: parseFloat(price),
        category: category?.trim(),
        description: description?.trim(),
      };
    });

    await Product.insertMany(products);

    res.status(200).json({
      message: 'Products uploaded successfully',
      count: products.length,
    });
  } catch (error) {
    console.error('Bulk Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload products' });
  }
};