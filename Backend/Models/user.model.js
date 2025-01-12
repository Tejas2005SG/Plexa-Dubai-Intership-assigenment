import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\+\d{10,}$/.test(v);
        },
        message:
          "Please enter a valid phone number with country code (e.g., +911234567890)",
      },
    },
    panCardNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 10,
      maxlength: 10,
      match: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
      
    },
    role: {
      type: String,
      enum: ["citizen", "admin"],
      default: "citizen",
    },
    campaigns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
      },
    ],
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
