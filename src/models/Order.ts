import mongoose from "mongoose";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends mongoose.Document {
  name: string;
  roomNumber: string;
  items: IOrderItem[];
  totalAmount: number;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
}

const OrderSchema = new mongoose.Schema<IOrder>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    roomNumber: {
      type: String,
      required: [true, "Please provide a room number"],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
