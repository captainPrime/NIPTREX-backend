import mongoose from 'mongoose';
import { IRating } from '../models/rating.model';
import { PaginationOptions } from '../interfaces/job.inteface';
declare class RatingService {
    rating: any;
    rateEntity(body: IRating): Promise<IRating>;
    getAllRating(filter: any, options: PaginationOptions): Promise<any[]>;
    getRatingById(id: mongoose.Types.ObjectId | string): Promise<IRating>;
    getRatingByUserId(id: mongoose.Types.ObjectId | string): Promise<IRating[] | null>;
    unRateEntity(id: mongoose.Types.ObjectId | string, body: Partial<IRating>): Promise<IRating>;
}
export default RatingService;
