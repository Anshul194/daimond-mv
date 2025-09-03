import mongoose from 'mongoose';
import slugify from 'slugify';

const { Schema, model, models } = mongoose;

const blogSchema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, trim: true, lowercase: true },
  description: { type: String },
  content: { type: String },
  date: { type: Date, default: Date.now },
  coverImage: { type: String, default: '' },
  thumbnailImage: { type: String, default: '' },
  BlogCategory: { type: Schema.Types.ObjectId, ref: 'BlogCategory', required: true },
  BlogSubCategory: { type: Schema.Types.ObjectId, ref: 'BlogSubCategory' },
  deletedAt: { type: Date, default: null },
}, { timestamps: true });

blogSchema.pre('validate', async function (next) {
  if (this.isModified('title') || !this.slug) {
    const baseSlug = slugify(this.title, { lower: true, strict: true });
    let uniqueSlug;
    const Blog = models.Blog;

    do {
      const rand = Math.floor(100 + Math.random() * 900);
      uniqueSlug = `${baseSlug}-${rand}`;
    } while (await Blog.exists({ slug: uniqueSlug, deletedAt: null, _id: { $ne: this._id } }));

    this.slug = uniqueSlug;
  }
  next();
});

export default models.Blog || model('Blog', blogSchema);
