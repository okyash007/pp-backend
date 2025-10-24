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
    identity_proof: {
      type: {
        type: String,
        enum: ["passport", "driver's license", "national identity card"],
        required: false,
      },
      document_id: {
        type: String,
        required: false,
      },
      issuing_country: {
        type: String,
        required: false,
      },
      front_image: {
        type: String,
        required: false,
      },
      back_image: {
        type: String,
        required: false,
      },
    },
    bank_account: {
      type: {
        type: String,
        enum: ["checking", "savings"],
        required: false,
      },
      account_number: {
        type: String,
        required: false,
      },
      ifsc_code: {
        type: String,
        required: false,
      },
      account_holder_name: {
        type: String,
        required: false,
      },
      bank_name: {
        type: String,
        required: false,
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
