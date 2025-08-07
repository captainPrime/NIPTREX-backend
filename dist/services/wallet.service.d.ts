import { ITransaction, IUpdateWallet, IWallet } from '../models/wallet.model';
declare class WalletService {
    wallet: any;
    transaction: any;
    createWallet(body: IWallet): Promise<IWallet>;
    getTransactionByUserId(userId: string): Promise<ITransaction | null>;
    getTransactions(): Promise<ITransaction[] | null>;
    getTransactionById(id: string): Promise<ITransaction | null>;
    createTransaction(body: ITransaction): Promise<ITransaction | null>;
    updateWallet(walletId: string, data: IUpdateWallet): Promise<IWallet | null>;
}
export default WalletService;
