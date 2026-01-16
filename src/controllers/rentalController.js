import Rental from "../models/Rental.js";
import Vehicle from "../models/Vehicle.js";

// Book a Vehicle
export async function bookVehicle(req, res) {
    try {
        const { vehicleId, startDate, endDate } = req.body;

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
        if (!vehicle.isAvailable) return res.status(400).json({ message: "Vehicle is not available" });
        if (vehicle.ownerId.toString() === req.user.id) return res.status(400).json({ message: "Cannot rent your own vehicle" });


        const rental = await Rental.create({
            renterId: req.user.id,
            vehicleId,
            ownerId: vehicle.ownerId,
            startDate,
            endDate,
            status: "active"
        });

        // Mark vehicle as unavailable
        vehicle.isAvailable = false;
        await vehicle.save();

        res.status(201).json({ message: "Vehicle booked successfully", rental });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Return a Vehicle
export async function returnVehicle(req, res) {
    try {
        const rentalId = req.params.id;
        const rental = await Rental.findById(rentalId);

        if (!rental) return res.status(404).json({ message: "Rental not found" });

        // Ensure it's the renter returning it
        if (rental.renterId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to return this vehicle" });
        }

        if (rental.status !== "active") {
            return res.status(400).json({ message: "Rental is already completed or cancelled" });
        }

        rental.status = "completed";
        rental.actualReturnDate = new Date();
        await rental.save();

        // Mark vehicle as available
        await Vehicle.findByIdAndUpdate(rental.vehicleId, { isAvailable: true });

        res.status(200).json({ message: "Vehicle returned successfully", rental });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Get My Rentals (Active)
export async function getMyActiveRentals(req, res) {
    try {
        const rentals = await Rental.find({ renterId: req.user.id, status: "active" })
            .populate("vehicleId", "name location images price")
            .populate("ownerId", "fullName phoneNumber");
        res.status(200).json(rentals);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

// Get My Rental History
export async function getMyRentalHistory(req, res) {
    try {
        const rentals = await Rental.find({ renterId: req.user.id, status: "completed" })
            .populate("vehicleId", "name location images")
            .populate("ownerId", "fullName");
        res.status(200).json(rentals);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

// Get Incoming Bookings (For Owners)
export async function getOwnerBookings(req, res) {
    try {
        const rentals = await Rental.find({ ownerId: req.user.id })
            .populate("vehicleId", "name")
            .populate("renterId", "fullName phoneNumber profilePic");
        res.status(200).json(rentals);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
