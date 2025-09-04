import mongoose from "mongoose";
import slugify from "slugify";

const { Schema, model, models } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 191,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 191,
    },
    gender: {
      type: String,
      enum: ["man", "woman", "both"],
      default: "both",
    },
    summary: {
      type: String,
      default: "",
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory_id: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      default: null,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: mongoose.Schema.Types.Mixed, // Allows both string and array
      default: [],
    },
    price: {
      type: Number,
      default: null,
    },
    saleprice: {
      type: Number,
      default: null,
    },
    cost: {
      type: Number,
      default: null,
    },
    badge: {
      type: Schema.Types.ObjectId,
      ref: "Badge",
      default: null,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      maxlength: 50,
    },

    productType: {
      type: Number,
      required: true,
      default: 1,
    },
    soldCount: {
      type: Number,
      default: null,
    },
    minPurchase: {
      type: Number,
      default: null,
    },
    maxPurchase: {
      type: Number,
      default: null,
    },
    isRefundable: {
      type: Boolean,
      default: null,
    },
    isInHouse: {
      type: Boolean,
      required: true,
      default: true,
    },
    isInventoryWarnAble: {
      type: Boolean,
      default: null,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
      index: true,
    },
    isTaxable: {
      type: Boolean,
      default: false,
    },
    taxClass: {
      type: Schema.Types.ObjectId,
      ref: "TaxClass",
      default: null,
    },
    is_diamond: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Auto generate unique slug from name before saving
productSchema.pre("validate", async function (next) {
  if (this.isModified("name")) {
    const baseSlug = slugify(this.name, { lower: true, strict: true });
    const Product = mongoose.models.Product;
    let uniqueSlug;
    do {
      const randomNumber = Math.floor(100 + Math.random() * 900);
      uniqueSlug = `${baseSlug}-${randomNumber}`;
    } while (await Product.exists({ slug: uniqueSlug, deletedAt: null }));
    this.slug = uniqueSlug;
  }
  next();
});

// Soft delete middleware
// productSchema.pre('find', function(next) {
//     this.where({ deletedAt: null });
//     next();
// });
// productSchema.pre('findOne', function(next) {
//     this.where({ deletedAt: null });
//     next();
// });

// Indexes for faster querying
// productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ subCategory: 1 });

const Product = models.Product || model("Product", productSchema);

export default Product;
