/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { RequestWithUser } from '@interfaces/auth.interface';
import User from '@models/users.model';

const authMiddleware =
  (roles?: string[]) =>
  async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const Authorization = req.headers.authorization ? req.headers.authorization!.split('Bearer ')[1] : null;

      if (Authorization) {
        const verificationResponse = verify(Authorization, SECRET_KEY!);
        const findUser = await User.findById(verificationResponse.sub);

        if (findUser) {
          // Check user role
          const userRole = findUser.user; // Assuming user role is stored in 'user' property
          if (!roles || roles.includes(userRole)) {
            // If roles are not specified or user role is included in the specified roles, allow access
            req.user = findUser;
            next();
          } else {
            // If user role does not match the specified roles, throw unauthorized error
            next(new HttpException(401, 1031, 'UNAUTHORIZED_USER'));
          }
        } else {
          next(new HttpException(400, 1030, 'INVALID_AUTHORIZATION'));
        }
      } else {
        next(new HttpException(400, 1030, 'AUTHENTICATION_TOKEN_MISSING'));
      }
    } catch (error) {
      next(new HttpException(400, 1030, 'INVALID_AUTHORIZATION'));
    }
  };

export default authMiddleware;
