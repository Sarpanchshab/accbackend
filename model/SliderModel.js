const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema({
    image: {
        public_id: {
            type: String,
            Required: true,
        },
        url: {
            type: String,
            Required: true,
        },
    },
    
}, { timestamps: true });

module.exports = mongoose.model("Slider", sliderSchema);
