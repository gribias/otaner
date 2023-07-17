import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    reference: { type: String, required: true },
    description: { type: String, required: true },
    material:{
        type: mongoose.Schema.Types.Mixed,
        required: true
      },
    cost: { type: Number, required: true },
    size: { type: Number, required: false },
    photo: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userProduct: [{ type: String, required: true }]
  });

const productModel = mongoose.model('Product', ProductSchema);

export default productModel;