import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const cartSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  items: [
    {
      product_id: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      variant_id: {
        type: Schema.Types.ObjectId,
        ref: 'ProductInventoryDetail',
        default: null,
      },
      selected_size: {
        type: Schema.Types.ObjectId,
        ref: 'Size',
        default: null,
      },
      selected_color: {
        type: Schema.Types.ObjectId,
        ref: 'Color',
        default: null,
      },
      price: {
        type: Number,
        required: true,
      },
      options: {
        type: Schema.Types.Mixed, // For additional options like attributes, image, etc.
        default: {},
      },
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

cartSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

cartSchema.index({ user_id: 1 });

const Cart = models.Cart || model('Cart', cartSchema);

export default Cart;


