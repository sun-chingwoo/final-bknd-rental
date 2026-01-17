import Vehicle, { ALLOWED_LOCATIONS } from "../models/Vehicle.js";

export async function getLocations(req, res) {
    res.status(200).json(ALLOWED_LOCATIONS);
}

export async function getAvailableVehicles(req, res) {
    try {
        const { search } = req.query;
        let query = { isAvailable: true };

        if (search && search.trim() !== "") {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } }
            ];
        }

        const vehicles = await Vehicle.find(query).populate("ownerId", "fullName profilePic");
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function createVehicle(req, res) {
    try {
        const { name, location, price, images } = req.body;

        const vehicle = await Vehicle.create({
            ownerId: req.user.id,
            name,
            location,
            price,
            images
        });

        res.status(201).json({ message: "Vehicle listed successfully", vehicle });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getMyVehicles(req, res) {
    try {
        const vehicles = await Vehicle.find({ ownerId: req.user.id });
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getVehicleById(req, res) {
    try {
        const vehicle = await Vehicle.findById(req.params.id).populate("ownerId", "fullName phoneNumber profilePic");
        if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function updateVehicle(req, res) {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

        if (vehicle.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to update this vehicle" });
        }

        const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "Vehicle updated", vehicle: updatedVehicle });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteVehicle(req, res) {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

        if (vehicle.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this vehicle" });
        }

        vehicle.isDeleted = true;
        vehicle.isAvailable = false; 
        await vehicle.save();

        res.status(200).json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
