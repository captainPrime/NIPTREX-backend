import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { IWallet, WalletModel } from '@/models/wallet.model';

class WalletService {
  /*
  |--------------------------------------------------------------------------
  | Create Wallet
  |--------------------------------------------------------------------------
  */
  public async createWallet(userId: string): Promise<IWallet> {
    if (isEmpty(userId)) throw new HttpException(400, 6002, 'User ID cannot be empty');

    const wallet: IWallet = new WalletModel({
      userId,
      balance: 0,
      transactions: [],
    });

    const createdWallet: IWallet = await wallet.save();

    return createdWallet;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Wallet by User ID
  |--------------------------------------------------------------------------
  */
  public async getWalletByUserId(userId: string): Promise<IWallet | null> {
    if (isEmpty(userId)) throw new HttpException(400, 6002, 'User ID cannot be empty');

    const wallet: IWallet | null = await WalletModel.findOne({ userId }).exec();

    return wallet;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Wallet Balance
  |--------------------------------------------------------------------------
  */
  public async updateWalletBalance(walletId: string, amount: number): Promise<IWallet | null> {
    if (isEmpty(walletId)) throw new HttpException(400, 6002, 'Wallet ID cannot be empty');

    const wallet: IWallet | null = await WalletModel.findByIdAndUpdate(walletId, { $inc: { balance: amount } }, { new: true }).exec();

    return wallet;
  }

  /*
  |--------------------------------------------------------------------------
  | Add Transaction to Wallet
  |--------------------------------------------------------------------------
  */
  public async addTransaction(walletId: string, transactionId: string): Promise<IWallet | null> {
    if (isEmpty(walletId)) throw new HttpException(400, 6002, 'Wallet ID cannot be empty');

    const wallet: IWallet | any = await WalletModel.findByIdAndUpdate(walletId, { $push: { transactions: transactionId } }, { new: true }).exec();

    return wallet;
  }

  /*
  |--------------------------------------------------------------------------
  | Remove Transaction from Wallet
  |--------------------------------------------------------------------------
  */
  public async removeTransaction(walletId: string, transactionId: string): Promise<IWallet | null> {
    if (isEmpty(walletId)) throw new HttpException(400, 6002, 'Wallet ID cannot be empty');

    const wallet: IWallet | any = await WalletModel.findByIdAndUpdate(walletId, { $pull: { transactions: transactionId } }, { new: true }).exec();

    return wallet;
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Wallet
  |--------------------------------------------------------------------------
  */
  public async deleteWallet(walletId: string): Promise<IWallet | null> {
    if (isEmpty(walletId)) throw new HttpException(400, 6000, 'Wallet ID cannot be empty');

    const wallet: IWallet | null = await WalletModel.findByIdAndDelete(walletId).exec();

    return wallet;
  }
}

export default WalletService;
