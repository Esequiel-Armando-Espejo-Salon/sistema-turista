import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: any, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ status: 'error', message: 'No autorizado, requiere rol de administrador' });
    }
};