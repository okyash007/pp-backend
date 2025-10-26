import mongoose from "mongoose";

const onboardingSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "creators",
    },
    step: {
      type: Number,
      default: 1,
    },
    identity: {
      type: {
        type: String,
        enum: ["individual", "organisation"],
      },
      legal_name: {
        type: String,
      },
      pan_number: {
        type: String,
      },
      gst_in: {
        type: String,
      },
      pan_image: {
        type: String,
      },
      gst_in_image: {
        type: String,
      },
    },
    bank_account: {
      name: {
        type: String,
      },
      bank_name: {
        type: String,
      },
      account_number: {
        type: String,
      },
      ifsc_code: {
        type: String,
      },
      account_image: {
        type: String,
      },
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Onboarding = mongoose.model("onboardings", onboardingSchema);

export default Onboarding;
