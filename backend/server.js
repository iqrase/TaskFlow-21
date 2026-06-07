import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { connectDB } from './config/db.js'

import userRouter from './routes/userRoute.js'
import taskRouter from './routes/taskRoute.js'
import authRoutes from './routes/auth.js'

const app = express();
const httpServer = createServer(app)
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

// SOCKET.IO
export const onlineUsers = new Map()

const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://task-flow-eight-taupe.vercel.app',
      'https://task-flow-62u0jgdfl-iqrases-projects.vercel.app'
    ],
    credentials: true
  }
})

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join', (userId) => {
    onlineUsers.set(userId, socket.id)
    console.log('User joined:', userId)
  })

  socket.on('disconnect', () => {
    onlineUsers.forEach((value, key) => {
      if (value === socket.id) onlineUsers.delete(key)
    })
  })
})

export { io }

httpServer.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`)
})
