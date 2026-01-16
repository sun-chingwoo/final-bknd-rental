import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema({
    renterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    actualReturnDate: { type: Date },
    totalPrice: { type: Number }
}, {
    timestamps: true
});

const Rental = mongoose.model("Rental", rentalSchema);
export default Rental;
