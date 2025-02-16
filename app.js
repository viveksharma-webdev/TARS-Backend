const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dbConnect = require('./config/dbConfig.js');
const authRouter = require('./routes/authRouter.js');
const userRouter = require('./routes/userRouter.js');
const authenticated = require('./middleware/verifyUser.js');
const app = express();

dotenv.config();



app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api',authenticated, userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    dbConnect();
    console.log(`Backend is listening on ${port}`);
});
