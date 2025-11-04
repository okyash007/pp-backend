import Razorpay from "razorpay";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// Lazy initialization of Razorpay instance
let razorpayInstance = null;

/**
 * Get or initialize Razorpay instance
 * @returns {Razorpay} Razorpay instance
 * @throws {Error} If Razorpay credentials are not configured
 */
const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error(
        "Razorpay credentials are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables."
      );
    }

    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  return razorpayInstance;
};

// Business type enum for Razorpay
const businessTypes = [
  "proprietorship",
  "partnership",
  "private_limited",
  "public_limited",
  "llp",
  "ngo",
  "society",
  "trust",
  "huf",
];

// Profile address schema
const addressSchema = z
  .object({
    street1: z.string().optional(),
    street2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postal_code: z.string().optional(),
    country: z.string().optional(),
  })
  .optional();

// Profile schema
const profileSchema = z
  .object({
    category: z.string().optional(),
    subcategory: z.string().optional(),
    description: z.string().optional(),
    addresses: z
      .object({
        registered: addressSchema,
        operation: addressSchema,
      })
      .optional(),
  })
  .optional();

// Legal info schema
const legalInfoSchema = z
  .object({
    pan: z.string().optional(),
    gst: z.string().optional(),
    cin: z.string().optional(),
  })
  .optional();

// Business info schema
const businessInfoSchema = z
  .object({
    gst: z.string().optional(),
    pos: z
      .object({
        outward: z
          .object({
            code: z.string().optional(),
            description: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .optional();

// Settlement info schema
const settlementInfoSchema = z
  .object({
    account_type: z.enum(["bank_account", "vpa"]).optional(),
    bank_account: z
      .object({
        account_number: z.string().optional(),
        ifsc: z.string().optional(),
        account_holder_name: z.string().optional(),
      })
      .optional(),
    vpa: z.string().optional(),
  })
  .optional();

// Route account creation schema
const createRouteAccountSchema = z.object({
  email: z
    .string()
    .email("Please provide a valid email address")
    .min(1, "Email is required"),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please provide a valid phone number")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 characters"),
  legal_business_name: z
    .string()
    .min(1, "Legal business name is required")
    .max(200, "Legal business name must be less than 200 characters"),
  customer_facing_business_name: z
    .string()
    .max(200, "Customer-facing business name must be less than 200 characters")
    .optional(),
  business_type: z
    .enum(businessTypes, {
      errorMap: () => ({ message: "Invalid business type" }),
    })
    .optional(),
  profile: profileSchema,
  legal_info: legalInfoSchema,
  business_info: businessInfoSchema,
  settlement_info: settlementInfoSchema,
});

// Account ID validation schema
const accountIdSchema = z
  .string()
  .min(1, "Account ID is required")
  .regex(/^acc_[a-zA-Z0-9]+$/, "Invalid Razorpay account ID format");

// Update route account schema (all fields optional)
const updateRouteAccountSchema = z.object({
  email: z.string().email("Please provide a valid email address").optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please provide a valid phone number")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 characters")
    .optional(),
  legal_business_name: z
    .string()
    .min(1, "Legal business name is required")
    .max(200, "Legal business name must be less than 200 characters")
    .optional(),
  customer_facing_business_name: z
    .string()
    .max(200, "Customer-facing business name must be less than 200 characters")
    .optional(),
  business_type: z
    .enum(businessTypes, {
      errorMap: () => ({ message: "Invalid business type" }),
    })
    .optional(),
  profile: profileSchema,
  legal_info: legalInfoSchema,
  business_info: businessInfoSchema,
  settlement_info: settlementInfoSchema,
});

/**
 * Create a Razorpay Route Account (Sub-Merchant Account)
 * @param {Object} accountData - Account creation data
 * @param {String} accountData.email - Email address of the account holder
 * @param {String} accountData.phone - Phone number of the account holder
 * @param {String} accountData.legal_business_name - Legal business name
 * @param {String} accountData.business_type - Type of business (e.g., 'proprietorship', 'partnership', 'private_limited')
 * @param {String} accountData.customer_facing_business_name - Customer-facing business name
 * @param {Object} accountData.profile - Profile information
 * @param {Object} accountData.legal_info - Legal information (PAN, GST, etc.)
 * @param {Object} accountData.business_info - Business information
 * @param {Object} accountData.settlement_info - Settlement information (bank account details)
 * @returns {Promise<Object>} Created account details
 */
export const createRouteAccount = async (accountData) => {
  try {
    // Validate input data using Zod
    const validatedData = createRouteAccountSchema.parse(accountData);

    // Prepare account creation payload with defaults
    const accountPayload = {
      email: validatedData.email,
      phone: validatedData.phone,
      legal_business_name: validatedData.legal_business_name,
      customer_facing_business_name:
        validatedData.customer_facing_business_name ||
        validatedData.legal_business_name,
      business_type: validatedData.business_type || "proprietorship",
      profile: validatedData.profile || {},
      legal_info: validatedData.legal_info || {},
      business_info: validatedData.business_info || {},
      settlement_info: validatedData.settlement_info || {},
    };

    console.log("accountPayload", accountPayload);

    // Create the route account
    const razorpay = getRazorpayInstance();
    const account = await razorpay.accounts.create(accountPayload);

    return {
      success: true,
      account_id: account.id,
      account: account,
    };
  } catch (error) {
    console.error("Error creating Razorpay route account:", error);
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      throw new Error(
        `Validation failed: ${errorMessages.map((e) => e.message).join(", ")}`
      );
    }

    // Handle common Razorpay authorization issues explicitly
    if (
      (error?.statusCode === 400 || error?.statusCode === 401 || error?.statusCode === 403) &&
      (error?.error?.description === "Access Denied" || error?.message === "Access Denied")
    ) {
      throw new Error(
        "Access Denied from Razorpay. Ensure Route (Partner) product is enabled for your account and that you're using a Route-capable API key in the correct mode (test/live)."
      );
    }

    // Fallback
    throw new Error(
      error?.error?.description || error?.message || "Failed to create Razorpay route account"
    );
  }
};

/**
 * Get a Razorpay Route Account by ID
 * @param {String} accountId - Razorpay account ID
 * @returns {Promise<Object>} Account details
 */
export const getRouteAccount = async (accountId) => {
  try {
    // Validate account ID using Zod
    const validatedAccountId = accountIdSchema.parse(accountId);

    const razorpay = getRazorpayInstance();
    const account = await razorpay.accounts.fetch(validatedAccountId);

    return {
      success: true,
      account: account,
    };
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      console.error("Validation error:", errorMessages);
      throw new Error(
        `Validation failed: ${errorMessages.map((e) => e.message).join(", ")}`
      );
    }

    // Handle Razorpay API errors
    console.error("Error fetching Razorpay route account:", error);
    throw new Error(
      error.description ||
        error.message ||
        "Failed to fetch Razorpay route account"
    );
  }
};

/**
 * Update a Razorpay Route Account
 * @param {String} accountId - Razorpay account ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated account details
 */
export const updateRouteAccount = async (accountId, updateData) => {
  try {
    // Validate account ID and update data using Zod
    const validatedAccountId = accountIdSchema.parse(accountId);
    const validatedUpdateData = updateRouteAccountSchema.parse(updateData);

    const razorpay = getRazorpayInstance();
    const account = await razorpay.accounts.edit(
      validatedAccountId,
      validatedUpdateData
    );

    return {
      success: true,
      account: account,
    };
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      console.error("Validation error:", errorMessages);
      throw new Error(
        `Validation failed: ${errorMessages.map((e) => e.message).join(", ")}`
      );
    }

    // Handle Razorpay API errors
    console.error("Error updating Razorpay route account:", error);
    throw new Error(
      error.description ||
        error.message ||
        "Failed to update Razorpay route account"
    );
  }
};

/**
 * Delete a Razorpay Route Account
 * @param {String} accountId - Razorpay account ID
 * @returns {Promise<Object>} Deletion result
 */
export const deleteRouteAccount = async (accountId) => {
  try {
    // Validate account ID using Zod
    const validatedAccountId = accountIdSchema.parse(accountId);

    const razorpay = getRazorpayInstance();
    await razorpay.accounts.delete(validatedAccountId);

    return {
      success: true,
      message: "Account deleted successfully",
    };
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      console.error("Validation error:", errorMessages);
      throw new Error(
        `Validation failed: ${errorMessages.map((e) => e.message).join(", ")}`
      );
    }

    // Handle Razorpay API errors
    console.error("Error deleting Razorpay route account:", error);
    throw new Error(
      error.description ||
        error.message ||
        "Failed to delete Razorpay route account"
    );
  }
};

export default getRazorpayInstance;
