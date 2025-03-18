const SliderModel = require("../model/SliderModel.js");
const cloudinary = require("cloudinary").v2;

class SliderController {

    // Insert Image API
    static insertImage = async (req, res) => {
        try {
            // console.log(req.files)
            // console.log(req.files.image)
            // Check if image file exists
            if (!req.files || !req.files.image) {
                return res.status(400).json({ status: "fail", message: "No image file uploaded" });
            }

            const file = req.files.image;
            

            // Upload to Cloudinary
            const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "SliderImage",
            });

            // Save to MongoDB without title
            const data = new SliderModel({
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                },
            });

            await data.save();

            // Success Response
            res.status(201).json({
                status: "success",
                message: "Image added successfully",
                slider: data,
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "error", message: "Something went wrong" });
        }
    };

    // View All Images API (No change needed)
    static viewAllImages = async (req, res) => {
        try {
            const images = await SliderModel.find().sort({ createdAt: -1 });

            res.status(200).json({
                status: "success",
                total: images.length,
                data: images,
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "error", message: "Server Error" });
        }
    };

    // Delete Image API (No change needed)
    static deleteImage = async (req, res) => {
        try {
            const { id } = req.params;

            // Find slider by ID
            const slider = await SliderModel.findById(id);

            if (!slider) {
                return res.status(404).json({ status: "fail", message: "Image not found" });
            }

            // Delete image from Cloudinary
            await cloudinary.uploader.destroy(slider.image.public_id);

            // Delete from MongoDB
            await SliderModel.findByIdAndDelete(id);

            res.status(200).json({
                status: "success",
                message: "Image deleted successfully",
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "error", message: "Server Error" });
        }
    };


}

module.exports = SliderController;
