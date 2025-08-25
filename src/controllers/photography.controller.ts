import { NextFunction, Request, Response } from 'express';
import Jimp from 'jimp';
import fs from 'fs';
import { flw } from '@/modules/flutterwave';
import cloudinary from '@/utils/cloudinary';
import UserService from '@/services/users.service';
import { HttpException } from '@/exceptions/HttpException';
import PhotographyService from '@/services/photography.service';
import path from 'path';
import { photographySchemaValidation } from '@/validations/photography.validation';
import { PaginationOptions } from '@/interfaces/job.inteface';
import { generateUUID } from '@/utils/matchPercentage';
import axios from 'axios';
import { FLW_SECRET_KEY } from '@/config';
import WalletService from '@/services/wallet.service';
import EmailService from '@/modules/email/email.service';

class PhotographyController {
  public userService = new UserService();
  public emailService = new EmailService();
  public walletService = new WalletService();
  public photographyService = new PhotographyService();

  /*
  |--------------------------------------------------------------------------
  | Create Photography
  |--------------------------------------------------------------------------
  */
  public createPhotography = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // return req.file;
      const { title, price, category, tags, licence, listAsNFT } = req.body;

      const { error } = photographySchemaValidation.validate({
        title,
        price,
        image: req.file,
        category,
        tags,
        licence,
        listAsNFT,
      });

      if (error) throw new HttpException(400, 9002, 'PHOTOGRAPHY_VALIDATION_ERROR', [error.details[0].message]);

      const user: any = await this.userService.findUserById(req.user.id);

      if (!user.verified) {
        throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
      }

      // The uploaded image can be accessed as req.file
      if (req.file) {
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
        const modifiedImageTempPath = path.join(__dirname, 'pictures', `${new Date()}-${req.file?.filename}.png`);
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
          category: Array.isArray(category) ? category : category?.split(',') || [],
          tags: Array.isArray(tags) ? tags : tags?.split(',') || [],
          licence,
          listAsNFT: listAsNFT === 'true' || listAsNFT === true,
        });

        return res.status(200).json({ status: 200, response_code: 3000, message: 'PHOTOGRAPHY_REQUEST_SUCCESSFUL', data });
      }

      throw new HttpException(400, 1004, 'ERROR_UPLOADING_IMAGE');
      // Continue with the rest of your code for creating a photography record
    } catch (error) {
      console.log(error);
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
      const userId: string = req.query.id ?? req.user.id;
      const user: any = await this.userService.findUserById(userId);

      if (!user.verified) {
        throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
      }

      const options: PaginationOptions = {
        sortBy: req.query.sortBy || 'created_at:desc',
        limit: parseInt(req.query.limit as string, 10) || 10,
        page: parseInt(req.query.page as string, 10) || 1,
        projectBy: req.query.projectBy || 'name:hide, role:hide',
        search: (req.query.search as any) || '',
        populate: 'user_id',
      };

      const filter = { user_id: userId };

      const data = await this.photographyService.getUserPhotography(options, filter);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PHOTOGRAPHY_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get User Preference
  |--------------------------------------------------------------------------
  */
  public getAllPhotography = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const options: PaginationOptions = {
        sortBy: req.query.sortBy || 'created_at:desc',
        limit: parseInt(req.query.limit as string, 10) || 10,
        page: parseInt(req.query.page as string, 10) || 1,
        search: (req.query.search as any) || '',
        projectBy: req.query.projectBy || 'name:hide, role:hide',
        populate: 'user_id',
      };

      const data = await this.photographyService.getAllPhotography(req.query, options);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PHOTOGRAPHY_REQUEST_SUCCESSFUL', data });
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

      res.status(200).json({ status: 200, response_code: 3000, message: 'PHOTOGRAPHY_REQUEST_SUCCESSFUL', data });
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

  //       res.status(200).json({ status: 200, response_code: 3000, message: 'PHOTOGRAPHY_REQUEST_SUCCESSFUL', data });
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

      res.status(200).json({ status: 200, response_code: 3000, message: 'PHOTOGRAPHY_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Charge Card
  |--------------------------------------------------------------------------
  */
  public makePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { currency, photography_id } = req.body;

      const photographyService = await this.photographyService.getPhotographyById(photography_id);
      if (!photographyService) throw new HttpException(400, 1102, 'PHOTOGRAPHY_NOT_FOUND');

      const paymentData = {
        tx_ref: generateUUID(),
        amount: photographyService.price,
        currency,
        redirect_url: `${process.env.NEXT_PUBLIC_API_URL}/photography/verify-payment`,
        meta: {
          consumer_id: req.user.id,
          consumer_mac: photography_id,
        },
        customer: {
          email: req.user.email,
          phonenumber: req.user.phone_number,
          name: `${req.user.first_name} ${req.user.last_name}`,
        },
      };

      const response = await axios.post('https://api.flutterwave.com/v3/payments', paymentData, {
        headers: {
          Authorization: `Bearer ${FLW_SECRET_KEY}`,
        },
      });

      res.status(200).json({ status: 200, response_code: 3000, message: 'PHOTOGRAPHY_REQUEST_SUCCESSFUL', data: response.data.data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Charge Card
  |--------------------------------------------------------------------------
  */
  public paymentCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, transaction_id } = req.body;
      if (status === 'successful' || status === 'completed') {
        // const transactionDetails = await flw.Transaction.find({ ref: tx_ref });
        const response = await flw.Transaction.verify({ id: transaction_id });
        // console.log('TRANSACTION_DETAILS', transactionDetails);
        console.log('TRANSACTION_VERIFY', response);
        if (response.data.status === 'successful') {
          // Success! Confirm the customer's payment
          const user: any = await this.userService.findUserById(response.data.meta.consumer_id);

          const photography = await this.photographyService.getPhotographyById(response.data.meta.consumer_mac.toString());
          if (!photography) throw new HttpException(400, 7002, 'PROPOSAL_NOT_FOUND');

          console.log('photography', photography);

          const transactionData: any = {
            user_id: user.id,
            proposal_id: response.data.meta?.consumer_mac,
            tx_ref: response.data.tx_ref,
            flw_ref: response.data.flw_ref,
            amount: response.data.amount,
            currency: response.data.currency,
            status: response.data.status,
            payment_type: response.data.payment_type,
            photography: photography.image,
            created_at: new Date(response.data.created_at),
            customer_id: response.data.customer?.id.toString() ?? response.meta?.consumer_id.toString(),
            customer_name: response.data.customer?.name,
            customer_email: response.data.customer?.email,
            nuban: response.data.meta?.originatoraccountnumber,
            bank: response.data.meta?.bankname,
            bank_name: response.data.meta?.originatorname,
            card_first_6digits: response.data.card?.first_6digits,
            card_last_4digits: response.data.card?.last_4digits,
            card_issuer: response.data.card?.issuer,
            card_country: response.data.card?.country,
            card_type: response.data.card?.type,
            card_expiry: response.data.card?.expiry,
          };

          const transaction = await this.walletService.createTransaction(transactionData);
          const emailPayload = {
            photographyId: photography.id,
            photographyTitle: photography.title,
            imageUrl: photography.image,
          };

          this.emailService.sendPhotographyPaymentConfirmationEmail(user.email, emailPayload, user.first_name);

          res.status(200).json({ status: 200, response_code: 3000, message: 'PHOTOGRAPHY_REQUEST_SUCCESSFUL', data: transaction });
        } else {
          res.status(200).json({ status: 400, response_code: 3002, message: 'PHOTOGRAPHY_REQUEST_ERROR', data: [] });
        }
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export default PhotographyController;
