// src/validators/user.validator.js
import Joi from "joi";

export const registerValidator = Joi.object({
    firstName: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.min": "First name must be at least 2 characters",
            "string.max": "First name cannot exceed 50 characters",
            "string.empty": "First name is required"
        }),

    lastName: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.min": "Last name must be at least 2 characters",
            "string.max": "Last name cannot exceed 50 characters",
            "string.empty": "Last name is required"
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.email": "Please provide a valid email",
            "string.empty": "Email is required"
        }),

    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .required()
        .messages({
            "string.min": "Password must be at least 8 characters",
            "string.pattern.base":
                "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
            "string.empty": "Password is required"
        }),

    phoneNumber: Joi.string()
        .pattern(/^\d{10}$/)
        .required()
        .messages({
            "string.pattern.base": "Phone number must be 10 digits",
            "string.empty": "Phone number is required"
        })
});