import { z } from "zod";

// Signup validation schema
export const signupSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .optional(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .optional(),
  email: z
    .string()
    .email("Please provide a valid email address")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please provide a valid phone number")
    .optional()
    .or(z.literal("")),
});

// Login validation schema
export const loginSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, "Email or username is required"),
  password: z
    .string()
    .min(1, "Password is required"),
});

// Update profile validation schema
export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .optional(),
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .optional(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please provide a valid phone number")
    .optional()
    .or(z.literal("")),
  image: z
    .object({
      src: z.string().url("Image source must be a valid URL").optional(),
    })
    .optional(),
  banner_image: z
    .object({
      src: z.string().url("Banner image source must be a valid URL").optional(),
    })
    .optional(),
});

// Validation middleware factory
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData; // Replace req.body with validated data
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errorMessages,
        });
      }
      next(error);
    }
  };
};
