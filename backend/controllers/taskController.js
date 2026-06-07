import Task from '../models/taskModel.js';
import Notification from '../models/notificationModel.js'
import userModel from '../models/userModel.js'

// CREATE A NEW TASK
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, completed } = req.body;
    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      completed,
      owner: req.user._id
    });
    await task.save();
    return res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET ALL TASKS
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id });
    return res.status(200).json({ tasks });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET TASK BY ID
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json({ task });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// UPDATE TASK
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE TASK 
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Share task with another user
export const shareTask = async (req, res) => {
  try {
    const { email } = req.body
    const task = await Task.findById(req.params.id)

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' })
    if (task.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' })

    const userToShare = await userModel.findOne({ email })
    if (!userToShare)
      return res.status(404).json({ success: false, message: 'User not found' })

    if (task.sharedWith.includes(userToShare._id))
      return res.status(400).json({ success: false, message: 'Already shared with this user' })

    task.sharedWith.push(userToShare._id)
    await task.save()

    // Create notification
    await Notification.create({
      recipient: userToShare._id,
      sender: req.user._id,
      task: task._id,
      type: 'task_shared',
      message: `${req.user.name} shared a task "${task.title}" with you`
    })

    res.json({ success: true, message: 'Task shared successfully', task })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// Get tasks shared with me
export const getSharedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ sharedWith: req.user._id })
      .populate('owner', 'name email')
    res.json({ success: true, tasks })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// Get notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'name email')
      .populate('task', 'title')
      .sort({ createdAt: -1 })
    res.json({ success: true, notifications })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// Mark notification as read
export const markNotificationRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true })
    res.json({ success: true, message: 'Notification marked as read' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET ANALYTICS OVERVIEW
export const getAnalyticsOverview = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id })
    const total = tasks.length
    const completed = tasks.filter(t => t.completed).length
    const pending = tasks.filter(t => !t.completed).length
    const overdue = tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length
    const high = tasks.filter(t => t.priority?.toLowerCase() === 'high').length
    const medium = tasks.filter(t => t.priority?.toLowerCase() === 'medium').length
    const low = tasks.filter(t => t.priority?.toLowerCase() === 'low').length

    res.json({
      success: true,
      overview: { total, completed, pending, overdue, high, medium, low }
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET ANALYTICS TRENDS (weekly)
export const getAnalyticsTrends = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id })

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const weekly = days.map(day => ({ day, completed: 0, pending: 0 }))

    tasks.forEach(task => {
      const dayIndex = new Date(task.createdAt).getDay()
      if (task.completed) {
        weekly[dayIndex].completed++
      } else {
        weekly[dayIndex].pending++
      }
    })

    // Monthly trends (last 6 months)
    const months = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthName = date.toLocaleString('default', { month: 'short' })
      const year = date.getFullYear()
      const month = date.getMonth()

      const monthTasks = tasks.filter(t => {
        const d = new Date(t.createdAt)
        return d.getMonth() === month && d.getFullYear() === year
      })

      months.push({
        month: monthName,
        completed: monthTasks.filter(t => t.completed).length,
        pending: monthTasks.filter(t => !t.completed).length
      })
    }

    res.json({ success: true, weekly, monthly: months })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}



