import mongoose from 'mongoose';
import slugify from 'slugify';

const { Schema, model, models } = mongoose;

const blogCategorySchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  image: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  deletedAt: { type: Date, default: null }
}, {
  timestamps: true
});

blogCategorySchema.pre('validate', async function (next) {
  if (this.isModified('name') || !this.slug) {
    const baseSlug = slugify(this.name, { lower: true, strict: true });
    let uniqueSlug;
    const BlogCategory = mongoose.models.BlogCategory;

    do {
      const random = Math.floor(100 + Math.random() * 900);
      uniqueSlug = `${baseSlug}-${random}`;
    } while (
      await BlogCategory.exists({ slug: uniqueSlug, deletedAt: null, _id: { $ne: this._id } })
    );

    this.slug = uniqueSlug;
  }

  next();
});

const BlogCategory = models.BlogCategory || model('BlogCategory', blogCategorySchema);
export default BlogCategory;
