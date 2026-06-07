import express from "express";
import authMiddleware from "../middleware/auth.js";
import { getAnalyticsOverview, getAnalyticsTrends, createTask, deleteTask, getTaskById, getTasks, updateTask, shareTask, getSharedTasks, getNotifications, markNotificationRead } from '../controllers/taskController.js';

const taskRouter = express.Router();

taskRouter.get('/analytics/overview', authMiddleware, getAnalyticsOverview)
taskRouter.get('/analytics/trends', authMiddleware, getAnalyticsTrends)
taskRouter.get('/shared', authMiddleware, getSharedTasks)
taskRouter.get('/notifications', authMiddleware, getNotifications)
taskRouter.put('/notifications/:id/read', authMiddleware, markNotificationRead)

taskRouter.route('/')
    .get(authMiddleware, getTasks)
    .post(authMiddleware, createTask);

taskRouter.route('/:id')
    .get(authMiddleware, getTaskById)
    .put(authMiddleware, updateTask)
    .delete(authMiddleware, deleteTask);

taskRouter.put('/:id/share', authMiddleware, shareTask)

export default taskRouter;