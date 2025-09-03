import mongoose from 'mongoose';
import './Category.js';

const { Schema, model, models } = mongoose;

const productAttributeSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
     category_id: {
    type: Schema.Types.ObjectId,
    ref: 'Category', 
   
  },
  terms: [{  // Remove the wrapper object
    value: { 
      type: String, 
      required: true,
      trim: true  // Add trim to remove leading/trailing spaces
    },
    image: { 
      type: String, 
      default: "" 
    }
  }],
  deletedAt: {
    type: Date,
    default: null,
  },
  lastModifiedBy: {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false  // Make it optional since it's undefined
    },
    email: String,
    name: String,
    timestamp: Date,
  },
}, {
  timestamps: true
});

productAttributeSchema.index({ title: 1 });

productAttributeSchema.pre('find', function(next) {
  this.where({ deletedAt: null });
  next();
});

productAttributeSchema.pre('findOne', function(next) {
  this.where({ deletedAt: null });
  next();
});

const ProductAttribute = models.ProductAttribute || model('ProductAttribute', productAttributeSchema);
export default ProductAttribute;