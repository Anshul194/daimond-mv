import mongoose from 'mongoose';
import slugify from 'slugify';

const sizeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Size name is required'],
    trim: true,
    maxlength: [100, 'Size name cannot exceed 100 characters']
  },
  size_code: { 
    type: String, 
    required: [true, 'Size code is required'], 
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: [20, 'Size code cannot exceed 20 characters']
  },
  slug: { 
    type: String, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null,
    index: true
  },
  deleted: { 
    type: Boolean, 
    default: false 
  },
  deletedAt: { 
    type: Date, 
    default: null 
  }
}, { timestamps: true });

// Pre-save middleware to generate slug
sizeSchema.pre('save', async function(next) {
  if (!this.isModified('name')) return next();
  
  const baseSlug = slugify(this.name, { lower: true, strict: true });
  let uniqueSlug = baseSlug;
  let counter = 1;
  
  // Make slug unique
  while (await this.constructor.exists({ 
    slug: uniqueSlug, 
    deletedAt: null, 
    _id: { $ne: this._id } 
  })) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  this.slug = uniqueSlug;
  next();
});

// Index for better performance
sizeSchema.index({ deletedAt: 1 });
sizeSchema.index({ name: 1, deletedAt: 1 });
sizeSchema.index({ size_code: 1, deletedAt: 1 });
sizeSchema.index({ slug: 1, deletedAt: 1 });

export default mongoose.models.Size || mongoose.model('Size', sizeSchema);