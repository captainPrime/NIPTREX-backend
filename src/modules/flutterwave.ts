import { FLW_PUBLIC_KEY, FLW_SECRET_KEY } from '@/config';
import Flutterwave from 'flutterwave-node-v3';

export const flw = new Flutterwave(FLW_PUBLIC_KEY, FLW_SECRET_KEY);
