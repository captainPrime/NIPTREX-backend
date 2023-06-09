import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { ITransaction, IUpdateWallet, IWallet, TransactionModel, WalletModel } from '@/models/wallet.model';
import { transactionValidationSchema } from '@/validations/payment.validation';

class WalletService {
  public wallet: any = WalletModel;
  public transaction: any = TransactionModel;

  /*
  |--------------------------------------------------------------------------
  | Create Wallet
  |--------------------------------------------------------------------------
  */
  public async createWallet(body: IWallet): Promise<IWallet> {
    if (isEmpty(body)) throw new HttpException(400, 6002, 'All fields cannot be empty');

    const wallet: IWallet = await this.wallet.create(body);

    return wallet;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Transaction by User ID
  |--------------------------------------------------------------------------
  */
  public async getTransactionByUserId(userId: string): Promise<ITransaction | null> {
    if (isEmpty(userId)) throw new HttpException(400, 6002, 'User ID cannot be empty');

    const transaction: ITransaction | null = await this.transaction.findOne({ user_id: userId });

    return transaction;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Transaction by User ID
  |--------------------------------------------------------------------------
  */
  public async getTransactionById(id: string): Promise<IWallet | []> {
    if (isEmpty(id)) throw new HttpException(400, 6002, 'ID cannot be empty');

    const wallet: IWallet | [] = await this.transaction.findOne({ _id: id });

    return wallet;
  }

  /*
  |--------------------------------------------------------------------------
  | Add Transaction to Wallet
  |--------------------------------------------------------------------------
  */
  public async createTransaction(body: ITransaction): Promise<ITransaction | null> {
    if (isEmpty(body)) throw new HttpException(400, 6002, 'body cannot be empty');

    const { error } = transactionValidationSchema.validate(body);
    if (error) throw new HttpException(400, 2002, 'PAYMENT_VALIDATION_ERROR', [error.details[0].message]);

    const transaction: ITransaction | any = await this.transaction.create(body);

    return transaction;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Wallet Balance
  |--------------------------------------------------------------------------
  */
  public async updateWallet(walletId: string, data: IUpdateWallet): Promise<IWallet | null> {
    if (isEmpty(walletId)) throw new HttpException(400, 6002, 'Wallet ID cannot be empty');

    const wallet: IWallet | null = await this.wallet.findByIdAndUpdate(walletId, data, { new: true });

    return wallet;
  }

  /*
  |--------------------------------------------------------------------------
  | Add Transaction to Wallet
  |--------------------------------------------------------------------------
  */
  // public async chargeCard(payload: IChargeCard): Promise<ITransaction | null> {
  //   if (isEmpty(payload)) throw new HttpException(400, 6002, 'bodycannot be empty');

  //   try {
  //     const response = await flw.Charge.card(payload);
  //     console.log(response);

  //     if (response.meta.authorization.mode === 'pin') {
  //       const payload2 = {
  //         ...payload,
  //         authorization: {
  //           mode: 'pin',
  //           fields: ['pin'],
  //           pin: 3310,
  //         },
  //       };

  //       const reCallCharge = await flw.Charge.card(payload2);
  //       const callValidate = await flw.Charge.validate({
  //         otp: '12345',
  //         flw_ref: reCallCharge.data.flw_ref,
  //       });

  //       console.log(callValidate); // uncomment for debugging purposes
  //     }

  //     if (response.meta.authorization.mode === 'redirect') {
  //       const url = response.meta.authorization.redirect;
  //       open(url);
  //     }

  //     res.status(200).json(response);
  //     // console.log(response); // uncomment for debugging purposes
  //   } catch (error) {
  //     console.log(error);
  //   }

  //   return transaction;
  // }
}

export default WalletService;
