/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import User from '@models/users.model';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const Authorization = req.headers.authorization ? req.headers.authorization!.split('Bearer ')[1] : null;

    if (Authorization) {
      const verificationResponse = verify(Authorization, SECRET_KEY!);
      const findUser = await User.findById(verificationResponse.sub);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(400, 1030, 'INVALID_AUTHORIZATION'));
      }
    } else {
      next(new HttpException(400, 1030, 'AUTHNETICATION_TOKEN_MISSING'));
    }
  } catch (error) {
    next(new HttpException(400, 1030, 'INVALID_AUTHORIZATION'));
  }
};

export default authMiddleware;
