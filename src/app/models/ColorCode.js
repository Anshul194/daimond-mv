import mongoose from 'mongoose';
import slugify from 'slugify';

const { Schema, model, models } = mongoose;

const colorCodeSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  colorCode: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        // Basic validation for hex colors or rgb/rgba
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v) || 
               /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(v) ||
               /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/.test(v);
      },
      message: 'Invalid color code format'
    }
  },
  
}, {
  timestamps: true
});

// Auto-generate unique slug from name
colorCodeSchema.pre('validate', async function (next) {
  if (this.isModified('name')) {
    const baseSlug = slugify(this.name, { lower: true, strict: true });
    const ColorCode = mongoose.models.ColorCode;
    let uniqueSlug;

    do {
      const randomNumber = Math.floor(100 + Math.random() * 900);
      uniqueSlug = `${baseSlug}-${randomNumber}`;
    } while (await ColorCode.exists({ slug: uniqueSlug }));

    this.slug = uniqueSlug;
  }
  next();
});


// Indexes
colorCodeSchema.index({ slug: 1 }, { unique: true });
colorCodeSchema.index({ colorCode: 1 });
colorCodeSchema.index({ deletedAt: 1 });

const ColorCode = models.ColorCode || model('ColorCode', colorCodeSchema);

export default ColorCode;