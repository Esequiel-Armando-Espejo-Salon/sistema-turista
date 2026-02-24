import dotenv from 'dotenv';
dotenv.config(); // 1) Load environment variables from the .env file

import app from './app';
import { ConnectionDB } from './config/db';

const PORT = process.env.PORT || 4000;

ConnectionDB();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
