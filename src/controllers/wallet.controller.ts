import { NextFunction, Request, Response } from 'express';
import UserService from '@/services/users.service';
import { HttpException } from '@/exceptions/HttpException';
import WalletService from '@/services/wallet.service';
import { IUpdateWallet, IWallet } from '@/models/wallet.model';
import { flw } from '@/modules/flutterwave';
import { generateTripleDESKey, generateUUID } from '@/utils/matchPercentage';
import { ENCRYPTION_KEY, FLW_SECRET_KEY } from '@/config';
import axios from 'axios';
import EmailService from '@/modules/email/email.service';
import BidService from '@/services/bid.service';
import JobService from '@/services/job.service';
import { JobStatus } from '@/interfaces/job.inteface';
import { BiddingStatus } from '@/models/bid.model';
import AboutService from '@/services/about.service';

class WalletController {
  public bidService = new BidService();
  public jobService = new JobService();
  public userService = new UserService();
  public aboutService = new AboutService();
  public emailService = new EmailService();
  public walletService = new WalletService();

  /*
  |--------------------------------------------------------------------------
  | Create Bio
  |--------------------------------------------------------------------------
  */
  public createWallet = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const userData = req.body;
      const user: any = await this.userService.findUserById(req.user.id);

      console.log('USER', user);

      if (!user.verified) {
        throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
      }

      // const wallet = await this.walletService.getWalletByUserId(req.user.id);
      // if (wallet) throw new HttpException(400, 6002, 'WALLET_ALREAD_CREATED');

      //   const headers = {
      //     'Content-Type': 'application/json',
      //     Accept: 'application/json',
      //     Authorization: `Bearer ${FLW_SECRET_KEY}`,
      //   };

      //   const response = await axios.post(
      //     'https://api.flutterwave.com/v3/payout-subaccounts',
      //     {
      //       account_reference: generateAlphaNumeric(20),
      //       email: user.email,
      //       mobilenumber: user.phone_number,
      //       country: 'NG',
      //       account_name: `${user.first_name} ${user.last_name}`,
      //       bank_code: 232,
      //       barter_id: '00874000',
      //     },
      //     { headers },
      //   );

      //   console.log('SUB_ACCOUNT', response);

      const result = await flw.VirtualAcct.create({
        tx_ref: generateUUID(),
        email: user.email,
        bvn: '19218268983',
        is_permanent: true,
        // firstname: user.first_name,
        // lastname: user.last_name,
        narration: 'Niptrix Wallet',
      });

      console.log(result);

      if (result.status !== 'success' && result.data.response_code !== '02') throw new HttpException(400, 6002, 'ERROR_CREATING_WALLET');

      const payload: IWallet | any = {
        user_id: req.user.id,
        currency: req.body.currency,
        expiry_date: result.data.expiry_date,
        account_number: result.data.account_number,
        account_status: result.data.account_status,
        bank_name: result.data.bank_name,
        order_ref: result.data.order_ref,
        flw_ref: result.data.flw_ref,
        amount: result.data.amount === 'NaN' ? '0' : result.data.amount,
      };
      const data = await this.walletService.createWallet(payload);

      res.status(200).json({ status: 200, response_code: 6000, message: 'WALLET_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get User Bio
  |--------------------------------------------------------------------------
  */
  public getUserTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.walletService.getTransactionByUserId(req.user.id);

      res.status(200).json({ status: 200, response_code: 6000, message: 'PAYMENT_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get User Bio
  |--------------------------------------------------------------------------
  */
  public getTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.walletService.getTransactions();

      res.status(200).json({ status: 200, response_code: 6000, message: 'PAYMENT_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get Bio By Id
  |--------------------------------------------------------------------------
  */
  public getTransactionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data = await this.walletService.getTransactionById(id);

      res.status(200).json({ status: 200, response_code: 6000, message: 'PAYMENT_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Update Bio
  |--------------------------------------------------------------------------
  */
  public updateWallet = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: IUpdateWallet = req.body;
      const data = await this.walletService.updateWallet(req.params.id, body);

      res.status(200).json({ status: 200, response_code: 6000, message: 'WALLET_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Create Bio
  |--------------------------------------------------------------------------
  */
  public createTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payloadData = req.body;

      const data = await this.walletService.createTransaction(payloadData);

      res.status(200).json({ status: 200, response_code: 6000, message: 'WALLET_REQUEST_SUCCESSFUL', data });
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
  public chargeCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { card_number, cvv, expiry_month, expiry_year, currency, amount } = req.body;
      const payload = {
        card_number,
        cvv,
        expiry_month,
        expiry_year,
        currency,
        amount,
        redirect_url: 'https://www.google.com',
        fullname: `${req.user.first_name} ${req.user.last_name}`,
        email: req.user.email,
        phone_number: req.user.phone_number,
        enckey: ENCRYPTION_KEY,
        tx_ref: generateTripleDESKey(),
      };

      const response = await flw.Charge.card(payload);
      console.log('RESPONSE', response);

      if (response.meta.authorization.mode === 'pin') {
        const payload2 = {
          ...payload,
          authorization: {
            mode: 'pin',
            fields: ['pin'],
            pin: 3310,
          },
        };

        const reCallCharge = await flw.Charge.card(payload2);
        const callValidate = await flw.Charge.validate({
          otp: '12345',
          flw_ref: reCallCharge.data.flw_ref,
        });

        console.log(callValidate); // uncomment for debugging purposes
      }

      if (response.meta.authorization.mode === 'redirect') {
        const url = response.meta.authorization.redirect;
        console.log(url);
        // open(url);
      }
      console.log(response); // uncomment for debugging purposes

      res.status(200).json({ status: 200, response_code: 6000, message: 'WALLET_REQUEST_SUCCESSFUL', data: response });
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
  public makePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount, currency, proposal_id } = req.body;

      const data = await this.bidService.getBidById(proposal_id);
      if (!data) throw new HttpException(400, 2002, 'PROPOSAL_NOT_FOUND');

      const proposalAmount = data.milestone_stage.reduce((total: any, stage: any) => total + stage.amount, 0);

      if (amount < proposalAmount) throw new HttpException(400, 2002, 'AMOUNT_LESS_THAN_PROPOSAL_AMOUNT');

      const paymentData = {
        tx_ref: generateUUID(),
        amount,
        currency,
        redirect_url: 'http://localhost:3000/client/dashboard',
        meta: {
          consumer_id: req.user.id,
          consumer_mac: proposal_id,
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

      res.status(200).json({ status: 200, response_code: 6000, message: 'PAYMENT_REQUEST_SUCCESSFUL', data: response.data.data });
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

          const proposal = await this.bidService.getBidById(response.data.meta.consumer_mac.toString());
          if (!proposal) throw new HttpException(400, 2002, 'PROPOSAL_NOT_FOUND');

          console.log('PROPOSAL', proposal);
          const job = await this.jobService.getJobByJobId(proposal.job_id.toString());
          if (!job) throw new HttpException(400, 2002, 'JOB_NOT_FOUND');

          const transactionData: any = {
            user_id: user.id,
            proposal_id: response.data.meta?.consumer_mac,
            tx_ref: response.data.tx_ref,
            flw_ref: response.data.flw_ref,
            amount: response.data.amount,
            currency: response.data.currency,
            status: response.data.status,
            payment_type: response.data.payment_type,
            created_at: new Date(response.data.created_at),
            customer_id: response.data.customer?.id,
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
            proposalId: proposal.id,
            jobTitle: job.job_title,
          };

          this.emailService.sendPaymentConfirmationEmail(user.email, emailPayload, user.first_name);

          if (job.status === JobStatus.ACTIVE) {
            const payload = {
              user_id: proposal.user_id,
              job_id: job._id.toString(),
              client_id: job.user_id.toString(),
              proposal: proposal.id,
            };

            await this.jobService.hireFreelancer(payload);

            // update job
            await this.jobService.updateJobById(job._id.toString(), {
              status: JobStatus.TAKEN,
              freelancer_id: proposal.user_id.toString(),
              activities: { invites_sent: +1, interviewing: +1, unanswered_invites: +1 },
            });

            // return user nips
            const bidders = await this.bidService.getAllBidders(job._id.toString());

            const userIds = bidders
              .filter((bidder: any) => bidder.user_id.toString() !== proposal.user_id.toString())
              .map((bidder: any) => bidder.user_id.toString());

            await this.bidService.updateBid(proposal.user_id, job._id.toString(), { status: BiddingStatus.IN_PROGRESS });

            userIds.forEach(async (userId: any) => {
              await this.aboutService.updateAboutById(userId, { nips: +5 });
              await this.bidService.updateBid(userId, job._id.toString(), { status: BiddingStatus.CLOSED });
            });
          }

          res.status(200).json({ status: 200, response_code: 6000, message: 'PAYMENT_REQUEST_SUCCESSFUL', data: transaction });
        } else {
          res.status(200).json({ status: 400, response_code: 6000, message: 'PAYMENT_REQUEST_ERROR', data: [] });
        }
      }
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
  public paymentWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // If you specified a secret hash, check for the signature
      const secretHash = 'niptrex-webhook';
      const signature = req.headers['verif-hash'];
      if (!signature || signature !== secretHash) {
        // This request isn't from Flutterwave; discard
        res.status(200).json({ status: 400, response_code: 6000, message: 'PAYMENT_REQUEST_ERROR', data: [] });
      }
      const payload = req.body;

      const transactionData: any = {
        user_id: payload.data.customer.id,
        proposal_id: payload.data.tx_ref,
        tx_ref: payload.data.tx_ref,
        flw_ref: payload.data.flw_ref,
        amount: payload.data.amount,
        currency: payload.data.currency,
        status: payload.data.status,
        payment_type: payload.data.payment_type,
        created_at: new Date(payload.data.created_at),
        customer_id: payload.data.customer?.id,
        customer_name: payload.data.customer?.name,
        customer_email: payload.data.customer?.email,
        nuban: payload.data.account?.nuban,
        bank: payload.data.account?.bank,
        card_first_6digits: payload.data.card?.first_6digits,
        card_last_4digits: payload.data.card?.last_4digits,
        card_issuer: payload.data.card?.issuer,
        card_country: payload.data.card?.country,
        card_type: payload.data.card?.type,
        card_expiry: payload.data.card?.expiry,
      };

      const transaction = await this.walletService.createTransaction(transactionData);

      res.status(200).json({ status: 200, response_code: 6000, message: 'PAYMENT_REQUEST_SUCCESSFUL', data: transaction });
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
  public payFreelancer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount, currency, narration, account_number } = req.body;
      const details = {
        account_bank: '044',
        account_number,
        amount,
        narration,
        currency,
        reference: generateUUID(),
        callback_url: 'https://webhook.site/b3e505b0-fe02-430e-a538-22bbbce8ce0d',
        debit_currency: 'NGN',
      };
      flw.Transfer.initiate(details).then(console.log).catch(console.log);
      // res.status(200).json({ status: 200, response_code: 6000, message: 'PAYMENT_REQUEST_SUCCESSFUL', data: transaction });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export default WalletController;
