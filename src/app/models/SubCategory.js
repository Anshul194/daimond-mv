import mongoose from 'mongoose';
import slugify from 'slugify';

const { Schema, model, models } = mongoose;

const subCategorySchema = new Schema({
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

  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    default: null,
  },
  deletedAt: {
    type: Date,
    default: null,
  }
}, {
  timestamps: true
});

// Auto generate slug from name before saving
subCategorySchema.pre('validate', async function (next) {
  if (this.isModified('name')) {   // <-- only if 'name' changed
    const baseSlug = slugify(this.name, { lower: true, strict: true });
    const SubCategory = mongoose.models.SubCategory;
    let uniqueSlug;

    do {
      const randomNumber = Math.floor(100 + Math.random() * 900); // 3-digit random number
      uniqueSlug = `${baseSlug}-${randomNumber}`;
    } while (await SubCategory.exists({ slug: uniqueSlug, deletedAt: null }));

    this.slug = uniqueSlug;
  }
  next();
});


// Indexes for faster querying
subCategorySchema.index({ slug: 1 }, { unique: true });
subCategorySchema.index({ name: 1 });
subCategorySchema.index({ category: 1 });

const SubCategory = models.SubCategory || model('SubCategory', subCategorySchema);

export default SubCategory;
