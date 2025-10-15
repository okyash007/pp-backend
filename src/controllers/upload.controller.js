import cloudinary from '../config/cloudinary.js';
import { ApiResponse } from '../utils/response.api.js';
import ApiError from '../utils/error.api.js';
import catchAsync from '../utils/catchAsync.js';
import { deleteLocalFile } from '../utils/cleanup.js';

export const uploadImage = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No image file provided');
  }

  try {
    // Check if file is SVG
    const isSvg = req.file.mimetype === 'image/svg+xml' || 
                  req.file.originalname.toLowerCase().endsWith('.svg');

    // Upload to Cloudinary with different configs for SVG vs other images
    const uploadOptions = {
      folder: 'pp-uploads', // Organize uploads in folder
      resource_type: 'auto'
    };

    // Apply transformations only for non-SVG files
    if (!isSvg) {
      uploadOptions.transformation = [
        { width: 1000, height: 1000, crop: 'limit' }, // Limit max dimensions
        { quality: 'auto' }, // Auto quality optimization
        { fetch_format: 'auto' } // Auto format (webp when supported)
      ];
    }

    const result = await cloudinary.uploader.upload(req.file.path, uploadOptions);

    // Clean up temporary file
    deleteLocalFile(req.file.path);

    // Return Cloudinary URL
    const response = new ApiResponse(
      200,
      {
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format
      },
      'Image uploaded successfully'
    );

    res.status(200).json(response);
  } catch (error) {
    // Clean up temporary file on error
    deleteLocalFile(req.file.path);
    throw new ApiError(500, 'Failed to upload image to Cloudinary');
  }
});
