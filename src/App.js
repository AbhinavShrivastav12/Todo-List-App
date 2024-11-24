import React, { useState, useEffect } from 'react';
import TodoItem from './component/TodoItem';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  // Fetch tasks from JSON Server
  useEffect(() => {
    fetch('http://localhost:5000/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  // Add a new task
  function addTask() {
    if (!taskText.trim()) return;
    const newTask = { text: taskText, completed: false };

    fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    })
      .then(response => response.json())
      .then(task => {
        setTasks([...tasks, task]);
        setTaskText('');
      })
      .catch(error => console.error('Error adding task:', error));
  }

  // Edit an existing task
  function editTask(id, text) {
    setIsEditing(true);
    setTaskText(text);
    setEditTaskId(id);
  }

  // Update an existing task
  function updateTask() {
    if (!taskText.trim()) return;
    const updatedTask = { text: taskText, completed: false };

    fetch(`http://localhost:5000/tasks/${editTaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask)
    })
      .then(response => response.json())
      .then(() => {
        setTasks(tasks.map(task => task.id === editTaskId ? { ...task, text: taskText } : task));
        setTaskText('');
        setIsEditing(false);
        setEditTaskId(null);
      })
      .catch(error => console.error('Error updating task:', error));
  }

  // Delete a task
  function deleteTask(id) {
    fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' })
      .then(() => setTasks(tasks.filter(task => task.id !== id)))
      .catch(error => console.error('Error deleting task:', error));
  }

  // Toggle task completion
  function toggleCompleted(id) {
    const task = tasks.find(task => task.id === id);
    const updatedTask = { ...task, completed: !task.completed };

    fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask)
    })
      .then(response => response.json())
      .then(() => {
        setTasks(tasks.map(task => task.id === id ? updatedTask : task));
      })
      .catch(error => console.error('Error toggling task:', error));
  }

  return (
    <div className="todo-app">
      <h1>Todo List</h1>
      <input
        type="text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        placeholder={isEditing ? "Edit your task" : "Add a new task"}
      />
      
      <button onClick={isEditing ? updateTask : addTask}>
        {isEditing ? 'Update' : 'Add'}
      </button>
      <div className="task-list " >
        {tasks.map((task) => (
          <TodoItem 
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            toggleCompleted={toggleCompleted}
            editTask={editTask}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
