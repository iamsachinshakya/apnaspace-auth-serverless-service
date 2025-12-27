import { z } from "zod";
import { AuthStatus, UserRole } from "../models/auth.entity";

export const registerUserSchema = z.object({
    username: z
        .string()
        .nonempty("Username is required")
        .trim()
        .toLowerCase()
        .min(3, "Username must be at least 3 characters long")
        .max(20, "Username must be at most 20 characters long")
        .regex(
            /^[a-z0-9_]+$/,
            "Username can only contain lowercase letters, numbers, and underscores"
        ),

    email: z
        .string()
        .nonempty("Email is required")
        .trim()
        .email("Invalid email address"),

    password: z
        .string()
        .nonempty("Password is required")
        .min(8, "Password must be at least 8 characters long")
        .max(64, "Password must be at most 64 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&#]/, "Password must contain at least one special character (@$!%*?&#)"),
});


export const loginUserSchema = z.object({
    email: z
        .string()
        .nonempty("Email is required")
        .trim()
        .email("Invalid email address"),

    password: z
        .string()
        .nonempty("Password is required")
        .min(8, "Password must be at least 8 characters long")
        .max(64, "Password must be at most 64 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&#]/, "Password must contain at least one special character (@$!%*?&#)"),
});


export const resetPasswordSchema = z.object({
    email: z
        .string()
        .nonempty("Email is required")
        .trim()
        .email("Invalid email address"),
    password: z
        .string()
        .nonempty("Password is required")
        .min(8, "Password must be at least 8 characters long")
        .max(64, "Password must be at most 64 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&#]/, "Password must contain at least one special character (@$!%*?&#)"),
});

/**
 * Schema: Update Auth
 * - All fields optional (partial updates)
 * - Enforces strong email & password validation
 * - Requires at least one field to be present
 */
export const updateAuthSchema = z
    .object({
        username: z
            .string()
            .trim()
            .min(3, "Username must be at least 3 characters long")
            .max(30, "Username must be at most 30 characters long")
            .optional(),

        email: z
            .string()
            .trim()
            .email("Invalid email format")
            .optional(),

        role: z
            .enum(UserRole)
            .optional(),

        status: z
            .enum(AuthStatus)
            .optional(),

        isVerified: z
            .boolean()
            .optional(),

        password: z
            .string()
            .nonempty("Password is required")
            .min(8, "Password must be at least 8 characters long")
            .max(64, "Password must be at most 64 characters long")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[@$!%*?&#]/, "Password must contain at least one special character (@$!%*?&#)")
            .optional(),
    })
    .refine(
        (data) => Object.values(data).some((v) => v !== undefined && v !== null),
        {
            message: "At least one field must be provided for update.",
            path: [],
        }
    );


