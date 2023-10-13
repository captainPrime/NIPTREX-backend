import { NextFunction, Request, Response } from 'express';
import cloudinary from '@/utils/cloudinary';
import UserService from '@/services/users.service';
import { HttpException } from '@/exceptions/HttpException';
import PhotographyService from '@/services/photography.service';

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
        console.log(req.file);
        // Handle the uploaded file, for example, save it to Cloudinary
        const image = req.file.path;
        const cloudinaryResponse = await this.uploadToCloudinary(image);

        // You can use the cloudinaryResponse here as needed
        const data = await this.photographyService.createPhotography({
          user_id: req.user.id,
          cloudinary_id: cloudinaryResponse?.public_id as string,
          image: cloudinaryResponse?.secure_url as string,
        });

        return res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
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
  public getUserPhotography = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: any = await this.userService.findUserById(req.user.id);

      if (!user.verified) {
        throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
      }

      const data = await this.photographyService.getUserPhotography(req.user.id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get Photography By Id
  |--------------------------------------------------------------------------
  */
  public getPhotographyById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data = await this.photographyService.getPhotographyById(id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Update Photography
  |--------------------------------------------------------------------------
  */
  //   public updatePhotography = async (req: Request, res: Response, next: NextFunction) => {
  //     try {
  //       const body: IUpdatePreference = req.body;
  //       const data = await this.photographyService.updatePhotography(req.user.id, body);

  //       res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
  //     } catch (error) {
  //       next(error);
  //     }
  //   };

  /*
  |--------------------------------------------------------------------------
  | Delete Photography
  |--------------------------------------------------------------------------
  */
  public deletePhotography = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data = await this.photographyService.deletePhotography(id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };
}

export default PhotographyController;
