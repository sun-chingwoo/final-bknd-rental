import { z } from "zod";

export const userSchema = z.object({
    fullName: z.string().min(3, "Name must be at least 3 characters"),
    phoneNumber: z.string()
        .transform(val => val.replace(/\D/g, ''))
        .pipe(z.string().length(10, "Phone number must be exactly 10 digits")),
    password: z.string().min(6, "Password must be at least 6 characters"),
    profilePic: z.string().optional(),
});

export const loginSchema = z.object({
    phoneNumber: z.string()
        .transform(val => val.replace(/\D/g, ''))
        .pipe(z.string().length(10, "Phone number must be exactly 10 digits")),
    password: z.string(),
});

export const vehicleSchema = z.object({
    name: z.string().min(1),
    location: z.string().min(1),
    price: z.number().positive(),
    images: z.array(z.string()).optional(),
});

export const rentalSchema = z.object({
    vehicleId: z.string(),
    startDate: z.string().or(z.date()),
    endDate: z.string().or(z.date()),
});
