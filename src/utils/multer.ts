import multer from 'multer';
import { Request } from 'express';

const multerStorage = multer.diskStorage({
  destination: (req: Request, file: any, callback: any) => {
    callback(null, __dirname);
  },

  filename: (req: Request, file: any, callback: any) => {
    callback(null, file.originalname);
  },
});

export const multerUpload = multer({ storage: multerStorage });
