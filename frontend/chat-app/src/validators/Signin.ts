import * as z from "zod";

export const signInSchema = z.object({
    identifier: z
        .string()
        .min(1, { message: "Username or email is required" })
        .refine(
            (value) => {
                // Check if the value is a valid email
                const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                // Check if the value is a valid username (e.g., alphanumeric, 3-20 characters)
                const isUsername = /^[a-zA-Z0-9_]{3,20}$/.test(value);
                return isEmail || isUsername;
            },
            { message: "Must be a valid email or username (3-20 alphanumeric characters)" }
        ),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(50, { message: "Password must not exceed 50 characters" }),
});

export const validateSignIn = (values: { identifier: string; password: string }) => {
    try {
        signInSchema.parse(values);
        return { success: true, errors: {} };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const formattedErrors = error.issues.reduce(
                (acc, curr) => ({
                    ...acc,
                    [curr.path[0]]: curr.message,
                }),
                {} as { identifier?: string; password?: string }
            );
            return { success: false, errors: formattedErrors };
        }
        return { success: false, errors: { general: "An unexpected error occurred" } };
    }
};