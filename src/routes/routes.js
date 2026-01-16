import express from "express";
import {
    signup,
    login,
    getProfile,
    updateProfile
} from "../controllers/authController.js";
import {
    getAvailableVehicles,
    createVehicle,
    getMyVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
    getLocations
} from "../controllers/vehicleController.js";
import {
    bookVehicle,
    returnVehicle,
    getMyActiveRentals,
    getMyRentalHistory,
    getOwnerBookings
} from "../controllers/rentalController.js";

import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { userSchema, loginSchema, vehicleSchema, rentalSchema } from "../validators/zodValidators.js";

const routes = express.Router();

// Auth Routes
routes.post("/auth/signup", validate(userSchema), signup);
routes.post("/auth/login", validate(loginSchema), login);
routes.get("/auth/profile", protect, getProfile);
routes.put("/auth/profile", protect, updateProfile);

// Vehicle Routes
routes.get("/vehicles", getAvailableVehicles); // Public
routes.get("/vehicles/my-listings", protect, getMyVehicles);
routes.get("/vehicles/locations", getLocations); // Public, must be before :id
routes.get("/vehicles/:id", getVehicleById); // Public/Protected
routes.post("/vehicles", protect, validate(vehicleSchema), createVehicle);
routes.put("/vehicles/:id", protect, updateVehicle);
routes.delete("/vehicles/:id", protect, deleteVehicle);

// Rental Routes
routes.post("/rentals/book", protect, validate(rentalSchema), bookVehicle);
routes.put("/rentals/:id/return", protect, returnVehicle);
routes.get("/rentals/current", protect, getMyActiveRentals);
routes.get("/rentals/history", protect, getMyRentalHistory);
routes.get("/rentals/incoming", protect, getOwnerBookings);

export default routes;