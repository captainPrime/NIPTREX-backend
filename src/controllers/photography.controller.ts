import { NextFunction, Request, Response } from 'express';
import Jimp from 'jimp';
import fs from 'fs';
import cloudinary from '@/utils/cloudinary';
import UserService from '@/services/users.service';
import { HttpException } from '@/exceptions/HttpException';
import PhotographyService from '@/services/photography.service';
import path from 'path';
import { photographySchemaValidation } from '@/validations/photography.validation';

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
      const { title, price } = req.body;

      const { error } = photographySchemaValidation.validate({ ...req.body, image: req.file?.path });

      if (error) throw new HttpException(400, 9002, 'PHOTOGRAPHY_VALIDATION_ERROR', [error.details[0].message]);

      const user: any = await this.userService.findUserById(req.user.id);

      if (!user.verified) {
        throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
      }

      // The uploaded image can be accessed as req.file
      if (req.file) {
        console.log(req.file);
        // Handle the uploaded file, for example, save it to Cloudinary
        const image = req.file.path;

        // Load the image using Jimp
        const loadedImage = await Jimp.read(image);

        // Add a text watermark to the image
        const watermarkText = req.user.first_name + req.user.last_name;
        const textWidth = Jimp.measureText(await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK), watermarkText);
        const textHeight = Jimp.measureTextHeight(await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK), watermarkText, 80);

        const x = (loadedImage.getWidth() - textWidth) / 2;
        const y = (loadedImage.getHeight() - textHeight) / 2;

        // Add the text watermark at the calculated position
        loadedImage.print(await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK), x, y, watermarkText);

        // Define the path to save the modified image in a "pictures" folder within the current directory
        const modifiedImageTempPath = path.join(__dirname, 'pictures', `${new Date()}-modified_image.png`);
        await loadedImage.writeAsync(modifiedImageTempPath);

        // Upload the temporary file to Cloudinary
        const cloudinaryResponse = await this.uploadToCloudinary(modifiedImageTempPath);

        // You can use the cloudinaryResponse here as needed

        // Delete the temporary file after uploading it to Cloudinary
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        fs.unlinkSync(modifiedImageTempPath);

        // You can use the cloudinaryResponse here as needed
        const data = await this.photographyService.createPhotography({
          user_id: req.user.id,
          title,
          price,
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

      const photography = await this.photographyService.getPhotographyById(id);
      await cloudinary.v2.uploader.destroy(photography.cloudinary_id);
      const data = await this.photographyService.deletePhotography(id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };
}

export default PhotographyController;
