import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderDate: { type: Date, required: true },
  orderNumber: { type: String, required: true },
  NumberArticles: { type: Number, required: true },
  Total: { type: Number, required: true },
  products: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: false },
      size: { type: Number, required: false },
      material:{ type: Object }
    },
  ],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  note: { type: String }, // Add the note field to the schema
  grams: { type: Object },// Add the grams field to the schema
  status: { type: Object },
});

const orderModel = mongoose.model("Order", OrderSchema);

export default orderModel;
