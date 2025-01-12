import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    campaignData: {
      billName: {
        type: [
          {
            type: String,
            trim: true,
          },
        ],
        required: true,
      },
      description: {
        type: [
          {
            type: String,
            trim: true,
          },
        ],
        required: true,
      },
      startDate: {
        type: [
          {
            type: String,
          },
        ],
        required: true,
      },
      endDate: {
        type: [
          {
            type: String,
          },
        ],
        required: true,
      },
      pan_number: {
        type: [
          {
            type: String,
            uppercase: true,
            trim: true,
            match: /^[A-Z]{5}[0-9]{4}[A-Z]$/, // PAN validation regex
          },
        ],
        required: true,
      },
      place: {
        type: [
          {
            type: String,
            uppercase: true,
            trim: true,
          },
        ],
        required: true,
      },
      campaign_name: {
        type: [
          {
            type: String,
            trim: true,
          },
        ],
        required: true,
      },
      amount: {
        type: [
          {
            type: String,
            trim: true,
          },
        ],
        required: true,
      },
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: [
        {
          type: String,
          enum: ["Pending", "Approved", "Rejected"],
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Campaign = mongoose.models.Campaign || mongoose.model("Campaign", campaignSchema);
export default Campaign;
