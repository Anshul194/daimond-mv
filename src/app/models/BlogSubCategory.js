import mongoose from 'mongoose';
import slugify from 'slugify';

const { Schema, model, models } = mongoose;

const blogSubCategorySchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  BlogCategory: { type: Schema.Types.ObjectId, ref: 'BlogCategory', required: true },
  image: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  deletedAt: { type: Date, default: null },
}, { timestamps: true });

blogSubCategorySchema.pre('validate', async function (next) {
  if (this.isModified('name') || !this.slug) {
    const baseSlug = slugify(this.name, { lower: true, strict: true });
    let uniqueSlug;
    const BlogSubCategory = mongoose.models.BlogSubCategory;

    do {
      const random = Math.floor(100 + Math.random() * 900);
      uniqueSlug = `${baseSlug}-${random}`;
    } while (await BlogSubCategory.exists({ slug: uniqueSlug, deletedAt: null, _id: { $ne: this._id } }));

    this.slug = uniqueSlug;
  }
  next();
});

const BlogSubCategory = models.BlogSubCategory || model('BlogSubCategory', blogSubCategorySchema);
export default BlogSubCategory;