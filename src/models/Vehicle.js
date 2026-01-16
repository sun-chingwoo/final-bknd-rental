import mongoose from "mongoose";

export const ALLOWED_LOCATIONS = [
    "Banashankari",
    "Bannerghatta Road",
    "Basavanagudi",
    "BTM Layout",
    "Chickpet",
    "Devanahalli",
    "Electronic City",
    "Frazer Town",
    "Hosur Road",
    "HSR Layout",
    "Indiranagar",
    "Jalahalli",
    "Jayanagar",
    "K.R. Market",
    "Kengeri",
    "Koramangala",
    "Malleshwaram",
    "Marathahalli",
    "Mathikere",
    "MG Road",
    "Mysore Road",
    "Nagarbhavi",
    "Nagasandra",
    "Nelamangala",
    "Outer Ring Road",
    "Peenya",
    "R.T. Nagar",
    "Raja Rajeshwari Nagar",
    "Rajajinagar",
    "Richmond Town",
    "Sadashivanagar",
    "Sarjapur Road",
    "Seshadripuram",
    "Shivajinagar",
    "Ulsoor",
    "Vasanth Nagar",
    "Vijayanagar",
    "Whitefield",
    "Yelahanka"
];

const vehicleSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    location: {
        type: String,
        required: true,
        enum: ALLOWED_LOCATIONS,
        message: '{VALUE} is not a valid location'
    },
    price: { type: Number, required: true },
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;