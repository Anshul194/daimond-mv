import mongoose from 'mongoose';
import slugify from 'slugify';

const { Schema, model, models } = mongoose;

const deliveryOptionSchema = new Schema(
  {
    icon: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    sub_title: {
      type: String,
      default: '',
      trim: true,
    },
   
 
  },
  {
    timestamps: true,
  }
);



const DeliveryOption =
  models.DeliveryOption || model('DeliveryOption', deliveryOptionSchema);

export default DeliveryOption;
