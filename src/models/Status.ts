import mongoose, { Document, Schema } from "mongoose";

interface IStatus extends Document {
  delivering: boolean;
}

const StatusSchema: Schema = new mongoose.Schema({
  delivering: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Status =
  mongoose.models.Status || mongoose.model<IStatus>("Status", StatusSchema);

export default Status;
