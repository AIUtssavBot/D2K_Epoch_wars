"use client"

import { useState, useEffect } from "react"
import { FaBuilding, FaUsers, FaTasks, FaClipboardCheck } from "react-icons/fa"
import "./Dashboard.css"

const Dashboard = () => {
  const [stats, setStats] = useState({
    facilities: 0,
    staff: 0,
    tasks: 0,
    completed: 0,
  })

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        setStats({
          facilities: 12,
          staff: 48,
          tasks: 156,
          completed: 89,
        })
      }, 1000)
    }

    loadData()
  }, [])

  return (
    <div className="dashboard fade-in">
      <h1 className="page-title">Facility Management Dashboard</h1>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon facility-icon">
            <FaBuilding />
          </div>
          <div className="stat-details">
            <h3>{stats.facilities}</h3>
            <p>Facilities</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon staff-icon">
            <FaUsers />
          </div>
          <div className="stat-details">
            <h3>{stats.staff}</h3>
            <p>Staff Members</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon task-icon">
            <FaTasks />
          </div>
          <div className="stat-details">
            <h3>{stats.tasks}</h3>
            <p>Total Tasks</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed-icon">
            <FaClipboardCheck />
          </div>
          <div className="stat-details">
            <h3>{stats.completed}</h3>
            <p>Completed Tasks</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card recent-activities">
          <div className="card-header">
            <h2 className="card-title">Recent Activities</h2>
          </div>
          <ul className="activity-list">
            <li className="activity-item">
              <span className="activity-time">10:30 AM</span>
              <span className="activity-text">HVAC maintenance completed in Building A</span>
            </li>
            <li className="activity-item">
              <span className="activity-time">09:15 AM</span>
              <span className="activity-text">New task assigned to maintenance team</span>
            </li>
            <li className="activity-item">
              <span className="activity-time">Yesterday</span>
              <span className="activity-text">Security system update scheduled</span>
            </li>
            <li className="activity-item">
              <span className="activity-time">Yesterday</span>
              <span className="activity-text">Monthly inspection report submitted</span>
            </li>
          </ul>
        </div>

        <div className="card facility-status">
          <div className="card-header">
            <h2 className="card-title">Facility Status</h2>
          </div>
          <div className="status-list">
            <div className="status-item">
              <span className="status-name">Building A</span>
              <div className="status-bar">
                <div className="status-progress" style={{ width: "92%" }}></div>
              </div>
              <span className="status-percentage">92%</span>
            </div>
            <div className="status-item">
              <span className="status-name">Building B</span>
              <div className="status-bar">
                <div className="status-progress" style={{ width: "78%" }}></div>
              </div>
              <span className="status-percentage">78%</span>
            </div>
            <div className="status-item">
              <span className="status-name">Building C</span>
              <div className="status-bar">
                <div className="status-progress" style={{ width: "85%" }}></div>
              </div>
              <span className="status-percentage">85%</span>
            </div>
            <div className="status-item">
              <span className="status-name">Building D</span>
              <div className="status-bar">
                <div className="status-progress" style={{ width: "64%" }}></div>
              </div>
              <span className="status-percentage">64%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

