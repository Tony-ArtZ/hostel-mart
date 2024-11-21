import mongoose from "mongoose";

export interface IProduct extends mongoose.Document {
  name: string;
  price: number;
  image: string;
  stock: number;
  description?: string;
  category?: string;
}

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for the product"],
      maxlength: [60, "Name cannot be more than 60 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price for the product"],
      min: [0, "Price cannot be negative"],
    },
    image: {
      type: String,
      required: [true, "Please provide an image URL"],
    },
    stock: {
      type: Number,
      required: [true, "Please provide stock quantity"],
      min: [0, "Stock cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
