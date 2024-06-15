import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';
import multer from'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { log } from 'console';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import {register} from './controllers/auth.js';
import { createPost } from './controllers/posts.js';
import { verifyToken } from './middleware/auth.js';

//CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

//FILE STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

//ROUTES WITH FILES
app.post('/auth/register', upload.single('picture'), verifyToken, register);
app.post('/posts', verifyToken, upload.single('picture'), createPost);  

//ROUTES
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

//MONGOOSE SETUP

// Import dotenv using ES module syntax

dotenv.config();

// Construct MongoDB URI using environment variables
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// Async function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
};

// Call the async function
connectDB();



