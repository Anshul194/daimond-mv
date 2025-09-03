import mongoose from 'mongoose';
import slugify from 'slugify';


const { Schema, model, models } = mongoose;

const categorySchema = new Schema({
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
  createdBy: {
    type: {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
      },
      email: String,
      name: String,
      timestamp: Date,
    },
  },
  lastModifiedBy: {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    email: String,
    name: String,
    timestamp: Date,
  },
  deletedAt: {
    type: Date,
    default: null,
  }
}, {
  timestamps: true
});

// Auto-generate unique slug before validate
// categorySchema.pre('validate', async function (next) {
//   if (this.name && !this.slug) {
//     const baseSlug = slugify(this.name, { lower: true, strict: true });
//     let uniqueSlug;
//     const Category = mongoose.models.Category;

//     do {
//       const randomNumber = Math.floor(100 + Math.random() * 900); // 3-digit random number
//       uniqueSlug = `${baseSlug}-${randomNumber}`;
//     } while (await Category.exists({ slug: uniqueSlug, deletedAt: null }));

//     this.slug = uniqueSlug;
//   }

//   next();
// });
categorySchema.pre('validate', async function (next) {
  // Only update slug if name changed or slug not set
  if (this.isModified('name') || !this.slug) {
    const baseSlug = slugify(this.name, { lower: true, strict: true });
    let uniqueSlug;
    const Category = mongoose.models.Category;

    do {
      const randomNumber = Math.floor(100 + Math.random() * 900);
      uniqueSlug = `${baseSlug}-${randomNumber}`;
      // exclude current document id from check (_id !== this._id)
    } while (await Category.exists({ slug: uniqueSlug, deletedAt: null, _id: { $ne: this._id } }));

    this.slug = uniqueSlug;
  }
  next();
});




// Indexes
categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ name: 1 });

const Category = models.Category || model('Category', categorySchema);
export default Category;