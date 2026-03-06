import jwt, { JwtPayload } from 'jsonwebtoken';
import {Account} from '../models/account';
import { Request, Response, NextFunction } from 'express';


export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      const user = await Account.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'user not found' });
      }

      req.user = {
        id: user._id.toString(),
        role: user.role,
      };

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  return res.status(401).json({ message: 'Unauthorized, token required' });
};