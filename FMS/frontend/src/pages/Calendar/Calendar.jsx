"use client"

import { useState, useEffect } from "react"
import { FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import axios from "axios"
import "./Calendar.css"

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState([])
  const [tasks, setTasks] = useState([])
  const [showAddTask, setShowAddTask] = useState(false)
  const [users, setUsers] = useState([])
  const [facilities, setFacilities] = useState([
    "Building A", 
    "Building B", 
    "Building C", 
    "Exterior", 
    "All Buildings"
  ])
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    facility: "Building A",
    priority: "medium",
    time: "09:00",
    assignedTo: "",
  })

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Generate random color for task highlights
  const getRandomColor = () => {
    const colors = ["#4361ee", "#3a86ff", "#ff9f1c", "#2ec4b6", "#e63946", "#588157", "#8338ec", "#fb8500"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const response = await axios.get("http://localhost:8000/api/users", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          setUsers(response.data)
        }
      } catch (error) {
        console.error("Error fetching users:", error)
        // Fallback to some default users if API fails
        setUsers([
          { id: "1", full_name: "John Doe", email: "john@example.com" },
          { id: "2", full_name: "Jane Smith", email: "jane@example.com" },
          { id: "3", full_name: "Mike Johnson", email: "mike@example.com" },
          { id: "4", full_name: "Sarah Williams", email: "sarah@example.com" },
          { id: "5", full_name: "Robert Brown", email: "robert@example.com" }
        ])
      }
    }
    
    fetchUsers()
  }, [])

  // Generate calendar days for the current month
  useEffect(() => {
    generateCalendarDays()
  }, [currentDate])

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // First day of the month
    const firstDay = new Date(year, month, 1)
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0)

    // Get the day of the week for the first day (0-6, where 0 is Sunday)
    const firstDayOfWeek = firstDay.getDay()

    // Calculate days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek

    // Calculate total days to show (previous month days + current month days)
    const totalDays = daysFromPrevMonth + lastDay.getDate()

    // Calculate rows needed (7 days per row)
    const rows = Math.ceil(totalDays / 7)

    // Calculate total cells in the calendar
    const totalCells = rows * 7

    const days = []

    // Add days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = 0; i < daysFromPrevMonth; i++) {
      const day = prevMonthLastDay - daysFromPrevMonth + i + 1
      days.push({
        day,
        month: month - 1 < 0 ? 11 : month - 1,
        year: month - 1 < 0 ? year - 1 : year,
        isCurrentMonth: false,
      })
    }

    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        day: i,
        month,
        year,
        isCurrentMonth: true,
      })
    }

    // Add days from next month
    const remainingCells = totalCells - days.length
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        day: i,
        month: month + 1 > 11 ? 0 : month + 1,
        year: month + 1 > 11 ? year + 1 : year,
        isCurrentMonth: false,
      })
    }

    setCalendarDays(days)
  }

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const response = await axios.get("http://localhost:8000/api/tasks", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          
          // Convert API tasks to calendar format
          const calendarTasks = response.data.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            facility: task.facility,
            priority: task.priority,
            date: new Date(task.dueDate),
            time: task.time || "09:00",
            assignedTo: task.assignedTo,
            color: getRandomColor(),
          }))
          
          setTasks(calendarTasks)
        }
      } catch (error) {
        console.error("Error fetching tasks:", error)
        // Fallback to dummy data if API fails
        setTimeout(() => {
          const dummyTasks = [
            {
              id: 1,
              title: "HVAC Maintenance",
              description: "Regular maintenance check for HVAC systems",
              facility: "Building A",
              priority: "high",
              date: new Date(2025, 2, 25), // March 25, 2025
              time: "10:00",
              assignedTo: "1", // User ID
              color: getRandomColor(),
            },
            {
              id: 2,
              title: "Plumbing Repair",
              description: "Fix leaking pipe in restroom",
              facility: "Building B",
              priority: "high",
              date: new Date(2025, 2, 24), // March 24, 2025
              time: "14:30",
              assignedTo: "2", // User ID
              color: getRandomColor(),
            },
            {
              id: 3,
              title: "Electrical Inspection",
              description: "Annual electrical system inspection",
              facility: "Building C",
              priority: "medium",
              date: new Date(2025, 2, 20), // March 20, 2025
              time: "09:00",
              assignedTo: "3", // User ID
              color: getRandomColor(),
            },
            {
              id: 4,
              title: "Landscaping",
              description: "Trim trees and bushes around the facility",
              facility: "Exterior",
              priority: "low",
              date: new Date(2025, 2, 28), // March 28, 2025
              time: "11:00",
              assignedTo: "4", // User ID
              color: getRandomColor(),
            },
          ]
          setTasks(dummyTasks)
        }, 500)
      }
    }

    fetchTasks()
  }, [])

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleDateClick = (day) => {
    // If clicking on a day from another month, switch to that month
    if (!day.isCurrentMonth) {
      setCurrentDate(new Date(day.year, day.month, 1))
    }

    const clickedDate = new Date(day.year, day.month, day.day)
    setSelectedDate(clickedDate)
  }

  const handleAddTask = () => {
    setShowAddTask(true)
  }

  const handleCancelAdd = () => {
    setShowAddTask(false)
    setNewTask({
      title: "",
      description: "",
      facility: "Building A",
      priority: "medium",
      time: "09:00",
      assignedTo: "",
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewTask((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitTask = async (e) => {
    e.preventDefault()
    
    try {
      // Format task for API
      const taskToSubmit = {
        title: newTask.title,
        description: newTask.description,
        facility: newTask.facility,
        priority: newTask.priority,
        dueDate: selectedDate.toISOString().split('T')[0],
        time: newTask.time,
        assignedTo: newTask.assignedTo,
        status: "pending"
      }
      
      const token = localStorage.getItem("token")
      if (token) {
        // Create task at the backend
        const response = await axios.post("http://localhost:8000/api/tasks", taskToSubmit, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        // Add new task to calendar format
        const newCalendarTask = {
          id: response.data.id,
          ...newTask,
          date: selectedDate,
          color: getRandomColor(),
        }
        
        setTasks((prev) => [...prev, newCalendarTask])
      } else {
        // Fallback for demo if not authenticated
        const task = {
          id: tasks.length + 1,
          ...newTask,
          date: selectedDate,
          color: getRandomColor(),
        }
        setTasks((prev) => [...prev, task])
      }
      
      // Reset form and close it
      setShowAddTask(false)
      setNewTask({
        title: "",
        description: "",
        facility: "Building A",
        priority: "medium",
        time: "09:00",
        assignedTo: "",
      })
    } catch (error) {
      console.error("Error creating task:", error)
      // Add the task locally even if API fails (demo purposes)
      const task = {
        id: tasks.length + 1,
        ...newTask,
        date: selectedDate,
        color: getRandomColor(),
      }
      setTasks((prev) => [...prev, task])
      setShowAddTask(false)
      setNewTask({
        title: "",
        description: "",
        facility: "Building A",
        priority: "medium",
        time: "09:00",
        assignedTo: "",
      })
    }
  }

  // Get tasks for the selected date
  const getTasksForDate = (date) => {
    return tasks.filter(
      (task) =>
        task.date.getDate() === date.getDate() &&
        task.date.getMonth() === date.getMonth() &&
        task.date.getFullYear() === date.getFullYear(),
    )
  }

  // Check if a day has tasks
  const hasTasksForDay = (day) => {
    return tasks.some(
      (task) =>
        task.date.getDate() === day.day && task.date.getMonth() === day.month && task.date.getFullYear() === day.year,
    )
  }

  // Format date for display
  const formatDate = (date) => {
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }

  return (
    <div className="calendar-page fade-in">
      <div className="calendar-header">
        <h1 className="page-title">Calendar</h1>
        <div className="calendar-navigation">
          <button className="nav-btn" onClick={handlePrevMonth}>
            <FaChevronLeft />
          </button>
          <h2 className="current-month">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button className="nav-btn" onClick={handleNextMonth}>
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="calendar-container">
        <div className="calendar-grid">
          {/* Day names row */}
          {dayNames.map((day, index) => (
            <div key={index} className="day-name">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`calendar-day ${!day.isCurrentMonth ? "other-month" : ""} ${
                selectedDate.getDate() === day.day &&
                selectedDate.getMonth() === day.month &&
                selectedDate.getFullYear() === day.year
                  ? "selected"
                  : ""
              } ${
                new Date().getDate() === day.day &&
                new Date().getMonth() === day.month &&
                new Date().getFullYear() === day.year
                  ? "today"
                  : ""
              }`}
              onClick={() => handleDateClick(day)}
            >
              <div className="day-number">{day.day}</div>
              {hasTasksForDay(day) && (
                <div className="task-indicators">
                  {tasks
                    .filter(
                      (task) =>
                        task.date.getDate() === day.day &&
                        task.date.getMonth() === day.month &&
                        task.date.getFullYear() === day.year,
                    )
                    .slice(0, 3)
                    .map((task, i) => (
                      <div key={i} className="task-indicator" style={{ backgroundColor: task.color }}></div>
                    ))}
                  {tasks.filter(
                    (task) =>
                      task.date.getDate() === day.day &&
                      task.date.getMonth() === day.month &&
                      task.date.getFullYear() === day.year,
                  ).length > 3 && <div className="more-tasks">+</div>}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="selected-date-tasks">
          <div className="selected-date-header">
            <h3>{formatDate(selectedDate)}</h3>
            <button className="add-task-btn" onClick={handleAddTask}>
              <FaPlus /> Add Task
            </button>
          </div>

          {showAddTask && (
            <div className="add-task-form-container slide-in">
              <form className="add-task-form" onSubmit={handleSubmitTask}>
                <h4>Add New Task for {formatDate(selectedDate)}</h4>

                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newTask.description}
                    onChange={handleInputChange}
                    className="form-control"
                    rows="2"
                  ></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="facility">Facility</label>
                    <select
                      id="facility"
                      name="facility"
                      value={newTask.facility}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    >
                      {facilities.map((facility, index) => (
                        <option key={index} value={facility}>{facility}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                      id="priority"
                      name="priority"
                      value={newTask.priority}
                      onChange={handleInputChange}
                      className="form-control"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="time">Time</label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={newTask.time}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="assignedTo">Assigned To</label>
                  <select
                    id="assignedTo"
                    name="assignedTo"
                    value={newTask.assignedTo}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  >
                    <option value="">Select Employee</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleCancelAdd}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Task
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="tasks-for-date">
            {getTasksForDate(selectedDate).length === 0 ? (
              <p className="no-tasks">No tasks scheduled for this date.</p>
            ) : (
              <div className="task-list-for-date">
                {getTasksForDate(selectedDate)
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((task) => (
                    <div key={task.id} className="task-item slide-in" style={{ borderLeftColor: task.color }}>
                      <div className="task-time">{task.time}</div>
                      <div className="task-content">
                        <h4 className="task-title">{task.title}</h4>
                        <p className="task-description">{task.description}</p>
                        <div className="task-details">
                          <span className="task-facility">{task.facility}</span>
                          <span className={`task-priority ${task.priority}`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar

