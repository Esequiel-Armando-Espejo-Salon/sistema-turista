import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from the .env file

// @desc Handle global errors
// @route N/A


// @access Public
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => { // Tipar 'err' como 'any' o 'Error'
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        status: 'error',
        message: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

export default errorHandler;