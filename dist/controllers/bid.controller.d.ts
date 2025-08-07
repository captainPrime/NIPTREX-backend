import { NextFunction, Request, Response } from 'express';
import BidService from '@/services/bid.service';
import JobService from '@/services/job.service';
import UserService from '@/services/users.service';
import AboutService from '@/services/about.service';
declare class BidController {
    bidService: BidService;
    jobService: JobService;
    userService: UserService;
    aboutService: AboutService;
    bidJob: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getTopBidders: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getBidders: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateMilestone: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateOutrightStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProposalById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    likeProposal: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    dislikeProposal: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    archiveProposal: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUserArchivedProposals: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    shortlistProposal: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUserShortlistProposals: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    requestMilestoneReview: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default BidController;
