import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js'

import userRouter from './routes/userRoute.js'
import taskRouter from './routes/taskRoute.js'
import authRoutes from './routes/auth.js'

const app = express();
const port = process.env.PORT || 4001;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://task-flow-eight-taupe.vercel.app',
    'https://task-flow-62u0jgdfl-iqrases-projects.vercel.app'
  ],
  credentials: true
}))

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB CONNECT
connectDB();

// ROUTES
app.use("/api/user", userRouter);
app.use("/api/tasks", taskRouter);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('API WORKING');
})

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`)
})
