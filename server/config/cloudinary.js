// server/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folderPath = 'naac-portal/general';
    if (req.user && req.user._id) {
      if (req.params.criterionId) {
        folderPath = `naac-portal/${req.user._id}/${req.params.criterionId}`;
      } else {
        folderPath = `naac-portal/${req.user._id}/misc`;
      }
    }
    
    // Determine resource_type
    let resource_type = 'raw';
    if (file.mimetype.startsWith('image/')) {
        resource_type = 'image';
    }

    return {
      folder: folderPath,
      allowed_formats: ['pdf', 'docx', 'jpg', 'jpeg', 'png'],
      resource_type: resource_type,
    };
  },
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

module.exports = { cloudinary, upload };
