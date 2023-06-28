import { IRating } from '@/models/rating.model';
import RatingService from '@/services/rating.service';
import { NextFunction, Request, Response } from 'express';
import { PaginationOptions } from '@/interfaces/job.inteface';

class RatingController {
  public ratingService = new RatingService();

  /*
  |--------------------------------------------------------------------------
  | Rate Entity
  |--------------------------------------------------------------------------
  */
  public rateEntity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ratingData: IRating | any = req.body;
      const entity_id: any = req.params.id;

      const data: any = await this.ratingService.rateEntity({ ...ratingData, entity_id, rating_value: +1 });

      res.status(200).json({ status: 200, response_code: 8000, message: 'RATING_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get Rating by ID
  |--------------------------------------------------------------------------
  */
  public getRatingById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;

      const data: IRating | null = await this.ratingService.getRatingById(id);

      res.status(200).json({ status: 200, response_code: 8000, message: 'RATING_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get Rating by user ID
  |--------------------------------------------------------------------------
  */
  public getRatingByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;

      const data: IRating[] | null = await this.ratingService.getRatingByUserId(id);

      res.status(200).json({ status: 200, response_code: 8000, message: 'RATING_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get User Rating
  |--------------------------------------------------------------------------
  */
  public getUserService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.user.id;

      const data: IRating[] | null = await this.ratingService.getRatingByUserId(id);

      res.status(200).json({ status: 200, response_code: 8000, message: 'RATING_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get Ratings
  |--------------------------------------------------------------------------
  */
  public getAllRatings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const options: PaginationOptions = {
        // sortBy: req.query.sortBy || 'date_posted:desc',
        limit: parseInt(req.query.limit as string, 10) || 5,
        page: parseInt(req.query.page as string, 10) || 1,
        projectBy: req.query.projectBy || 'name:hide, role:hide',
      };

      const data: any[] | null = await this.ratingService.getAllRating(req.query, options);

      res.status(200).json({ status: 200, response_code: 8000, message: 'RATING_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | UnRate Entity
  |--------------------------------------------------------------------------
  */
  public unRateEntity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const body: Partial<IRating> = req.body;

      const data: IRating = await this.ratingService.unRateEntity(id, { ...body, rating_value: -1 });

      res.status(200).json({ status: 200, response_code: 8000, message: 'RATING_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };
}

export default RatingController;
