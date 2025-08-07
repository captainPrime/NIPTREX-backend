"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hire = exports.SavedJob = exports.JobModel = void 0;
const job_inteface_1 = require("@/interfaces/job.inteface");
const profile_interface_1 = require("@/interfaces/profile.interface");
const toJSON_1 = require("@/modules/toJSON");
const paginate_1 = require("@/modules/paginate");
const mongoose_1 = require("mongoose");
const JobSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    freelancer_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    jobs_tags: [{ type: String, required: true }],
    job_title: { type: String, required: true },
    job_headline: { type: String, required: true },
    job_description: { type: String, required: true },
    attachments: [{ type: String }],
    links: [{ type: String }],
    project_duration: { type: String },
    hourly_rate: {
        min: { type: Number },
        max: { type: Number }, // Maximum hourly rate
    },
    budget: { type: Number },
    project_fixed: { type: Boolean, default: false },
    proposal_limit: { type: Number, default: 50 },
    proposal_left: { type: Number, default: 50 },
    experience_level: { type: String },
    activities: {
        proposals: { type: Number, default: 0 },
        last_viewed: { type: Date },
        interviewing: { type: Number, default: 0 },
        invites_sent: { type: Number, default: 0 },
        unanswered_invites: { type: Number, default: 0 },
    },
    verified: { type: Boolean, required: true, default: true },
    status: { type: String, enum: Object.values(job_inteface_1.JobStatus), default: job_inteface_1.JobStatus.ACTIVE },
    work_location: { type: String, required: true },
    job_type: { type: String, enum: Object.values(profile_interface_1.WorkOption), required: true },
    team_size: { type: String, required: true },
    industry_type: { type: String, required: true },
    nips: { type: Number, default: 5 },
    project_type: { type: String, required: true },
    soft_skills: [{ type: String }],
    languages: [{ type: String }],
    rating: {
        type: Number,
        required: false,
        default: 0,
    },
    date_posted: {
        type: Date,
        default: Date.now,
    },
    featured: { type: Boolean, required: false, default: false },
}, {
    timestamps: true,
});
JobSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    // Calculate proposalLeft by subtracting activities.proposals from proposalLimit
    if (update && update.activities && update.activities.proposals) {
        update.proposal_left = update.proposal_limit - update.activities.proposals;
    }
    next();
});
// JobSchema.pre('findOneAndUpdate', async function (this: any, doc: any) {
//   const oldStatus = doc.status;
//   const newStatus = this._update.status;
//   if (oldStatus !== newStatus) {
//     let status: string;
//     switch (newStatus) {
//       case 'taken':
//         status = 'cancelled';
//         break;
//       default:
//         status = 'pending';
//     }
//     await BiddingModel.updateMany({ job_id: doc._id }, { $set: { status } });
//   }
// });
const SavedJobSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Job', required: true },
}, {
    timestamps: true,
});
const HireJobSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    job_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Job', required: true },
    client_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    proposal: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Bidding', required: true },
}, {
    timestamps: true,
});
JobSchema.plugin(toJSON_1.toJSON);
JobSchema.plugin(paginate_1.paginate);
HireJobSchema.plugin(paginate_1.paginate);
SavedJobSchema.plugin(toJSON_1.toJSON);
const JobModel = (0, mongoose_1.model)('Job', JobSchema);
exports.JobModel = JobModel;
const SavedJob = (0, mongoose_1.model)('SavedJob', SavedJobSchema);
exports.SavedJob = SavedJob;
const Hire = (0, mongoose_1.model)('HireJob', HireJobSchema);
exports.Hire = Hire;
//# sourceMappingURL=job.model.js.map