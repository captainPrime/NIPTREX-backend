import { NextFunction, Request, Response } from 'express';
import UserService from '@/services/users.service';
import { HttpException } from '@/exceptions/HttpException';
import { IUpdatePreference } from '@/interfaces/profile.interface';
import PhotographyService from '@/services/photography.service';
import { upload } from '@/utils/multerConfig';
import cloudinary from '@/utils/cloudinary';

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
      const user: any = await this.userService.findUserById(req.user.id);

      if (!user.verified) {
        throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
      }

      // The uploaded image can be accessed as req.file
      if (req.file) {
        // Handle the uploaded file, for example, save it to Cloudinary
        const image = req.file.path;
        const cloudinaryResponse = await this.uploadToCloudinary(image);

        // You can use the cloudinaryResponse here as needed
        const data = await this.photographyService.createPhotography({
          user_id: req.user.id,
          cloudinary_id: cloudinaryResponse?.public_id,
          image: cloudinaryResponse?.secure_url,
        });
        res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
      }

      throw new HttpException(400, 1004, 'ERROR_UPLOADING_IMAGE');
      // Continue with the rest of your code for creating a photography record
    } catch (error) {
      next(error);
    }
  };

  // This function uploads the file to Cloudinary
  private async uploadToCloudinary(file: string) {
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    try {
      // Upload the image
      const result = await cloudinary.v2.uploader.upload(file, options);
      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
    }
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
