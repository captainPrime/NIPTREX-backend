import { NextFunction, Request, Response } from 'express';
import UserService from '@/services/users.service';
import { HttpException } from '@/exceptions/HttpException';
import { IUpdatePreference } from '@/interfaces/profile.interface';
import PhotographyService from '@/services/photography.service';
import { upload } from '@/utils/multerConfig';

class PhotographyController {
  public userService = new UserService();
  public photographyService = new PhotographyService();

  /*
  |--------------------------------------------------------------------------
  | Create Photography
  |--------------------------------------------------------------------------
  */
  public createPhotography = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Use the `upload.single('image')` middleware within the route handler
      upload.single('image')(req, res, async (err: any) => {
        if (err) {
          // Handle the error, e.g., return an error response
          //   throw new HttpException(400, 1004, 'ERROR_UPLOADING_IMAGE');
          return next(err);
        }

        const userData = req.body;
        const user: any = await this.userService.findUserById(req.user.id);

        if (!user.verified) {
          throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
        }

        // The uploaded image can be accessed as req.file
        // You can handle the file (e.g., save it to a database or cloud storage) here
        if (req.file) {
          // Handle the uploaded file, for example, save it to Cloudinary
          const image = req.file;
          const cloudinaryResponse = await this.uploadToCloudinary(image);

          // You can use the cloudinaryResponse here as needed
        }

        const data = await this.photographyService.createPhotography({ ...userData, user_id: req.user.id });

        res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
      });
    } catch (error) {
      next(error);
    }
  };

  // This function uploads the file to Cloudinary
  private async uploadToCloudinary(file: Express.Multer.File) {
    // Implement the logic to upload the file to Cloudinary here
    // You can use the cloudinary.v2.uploader.upload method
    // Return the Cloudinary response
  }

  /*
  |--------------------------------------------------------------------------
  | Get User Preference
  |--------------------------------------------------------------------------
  */
  public getUserPreference = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: any = await this.userService.findUserById(req.user.id);

      if (!user.verified) {
        throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
      }

      const data = await this.preferenceService.getUserPreference(req.user.id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get Preference By Id
  |--------------------------------------------------------------------------
  */
  public getPreferenceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data = await this.preferenceService.getPreferenceById(id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Update Preference
  |--------------------------------------------------------------------------
  */
  public updatePreference = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: IUpdatePreference = req.body;
      const data = await this.preferenceService.updatePreferenceById(req.user.id, body);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete Preference
  |--------------------------------------------------------------------------
  */
  public deletePreference = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data = await this.preferenceService.deletePreference(id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };
}

export default PhotographyController;
