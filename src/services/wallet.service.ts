import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { ITransaction, IUpdateWallet, IWallet, TransactionModel, WalletModel } from '@/models/wallet.model';

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
  | Get Wallet by User ID
  |--------------------------------------------------------------------------
  */
  public async getWalletByUserId(userId: string): Promise<IWallet | null> {
    if (isEmpty(userId)) throw new HttpException(400, 6002, 'User ID cannot be empty');

    const wallet: IWallet | null = await this.wallet.findOne({ user_id: userId }).exec();

    return wallet;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Wallet by User ID
  |--------------------------------------------------------------------------
  */
  public async getWalletById(id: string): Promise<IWallet | []> {
    if (isEmpty(id)) throw new HttpException(400, 6002, 'ID cannot be empty');

    const wallet: IWallet | [] = await this.wallet.findOne({ _id: id }).exec();

    return wallet;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Wallet Balance
  |--------------------------------------------------------------------------
  */
  public async updateWallet(walletId: string, data: IUpdateWallet): Promise<IWallet | null> {
    if (isEmpty(walletId)) throw new HttpException(400, 6002, 'Wallet ID cannot be empty');

    const wallet: IWallet | null = await this.wallet.findByIdAndUpdate(walletId, data, { new: true }).exec();

    return wallet;
  }

  /*
  |--------------------------------------------------------------------------
  | Add Transaction to Wallet
  |--------------------------------------------------------------------------
  */
  public async createTransaction(body: ITransaction): Promise<ITransaction | null> {
    if (isEmpty(body)) throw new HttpException(400, 6002, 'bodycannot be empty');

    const transaction: ITransaction | any = await this.transaction.create(body).exec();

    return transaction;
  }
}

export default WalletService;
