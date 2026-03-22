const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'college/thumbnails',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 450, crop: 'fill' }]
  },
});

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'college/videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi', 'mkv']
  },
});

const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'college/pdfs',
    resource_type: 'raw',
    allowed_formats: ['pdf']
  },
});

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'college/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 200, height: 200, crop: 'fill' }]
  },
});

exports.uploadThumbnail = multer({ storage: imageStorage });
exports.uploadVideo = multer({ storage: videoStorage });
exports.uploadPDF = multer({ storage: pdfStorage });
exports.uploadAvatar = multer({ storage: avatarStorage });
exports.cloudinary = cloudinary;
