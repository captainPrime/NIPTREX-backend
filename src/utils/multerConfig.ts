import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'your-cloud-name',
  api_key: 'your-api-key',
  api_secret: 'your-api-secret',
});

// Multer and Cloudinary Storage Configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req: any, _file) => {
    return {
      folder: 'images',
      allowedFormats: ['jpg', 'png'],
      transformation: [{ width: 500, height: 500, crop: 'limit' }],
    };
  },
});

const upload = multer({ storage: storage });

export { upload };
