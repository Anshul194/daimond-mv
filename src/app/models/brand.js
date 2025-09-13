import mongoose from 'mongoose';
import slugify from 'slugify';

const { Schema, model, models } = mongoose;

const brandSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  logo: {
    type: String,
    default: '', // This will be an image URL or file path
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    default: null,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true
});
brandSchema.pre('validate', async function (next) {
  if (this.isModified('name') || !this.slug) {
    const baseSlug = slugify(this.name, { lower: true, strict: true });
    let uniqueSlug;
    const Brand = mongoose.models.Brand;

    do {
      const randomNumber = Math.floor(100 + Math.random() * 900); // e.g., abc-423
      uniqueSlug = `${baseSlug}-${randomNumber}`;
    } while (await Brand.exists({ slug: uniqueSlug, deletedAt: null, _id: { $ne: this._id } }));

    this.slug = uniqueSlug;
  }

  next();
});
brandSchema.index({ slug: 1 }, { unique: true });
brandSchema.index({ name: 1 });
const Brand = models.Brand || model('Brand', brandSchema);
export default Brand;
