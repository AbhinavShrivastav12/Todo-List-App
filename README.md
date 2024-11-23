Let's create a Todo App with CRUD functionality (Create, Read, Update, Delete) using React, JSON Server, and a minimal CSS style for the UI. The app will interact with the JSON Server API to store, retrieve, update, and delete tasks.

Steps:
1. Set up JSON Server to simulate a backend.
2. Create React components for CRUD operations (Add, Edit, Delete, and List tasks).
3. Create a minimal CSS for responsive design.

1. Set Up JSON Server
a. Install JSON Server globally:

bash
# npm install -g json-server
 
b. Create a db.json file in your project directory to hold your task data:
{
  "tasks": []
}

c. Start JSON Server with:
#npx json-server --watch db.json --port 5000

2. Create React Components
a. App Component (App.js)
This component will manage the tasks, handle the state, and pass data to child components.
import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
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
      <div className="task-list">
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
b. TodoItem Component (TodoItem.js)
This component represents each task, allowing you to edit, delete, and mark tasks as completed.
import React from 'react';

function TodoItem({ task, deleteTask, toggleCompleted, editTask }) {
  return (
    <div className={`todo-item ${task.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleCompleted(task.id)}
      />
      <span>{task.text}</span>
      <button onClick={() => editTask(task.id, task.text)}>Edit</button>
      <button onClick={() => deleteTask(task.id)}>Delete</button>
    </div>
  );
}

export default TodoItem;

3. CSS (Minimal and Responsive UI)
Add the following CSS in App.css to style the app in a minimal and responsive way.

App.css:
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.todo-app {
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  font-size: 24px;
}

input[type="text"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.task-list {
  margin-top: 20px;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
}

.todo-item.completed span {
  text-decoration: line-through;
  color: #888;
}

button {
  margin-left: 5px;
}

button:hover {
  background-color: #f44336;
}

@media (max-width: 600px) {
  .todo-app {
    width: 90%;
    padding: 15px;
  }

  button {
    width: 48%;
    margin-bottom: 5px;
  }
}

4. Running the App
Start JSON Server:

Run the command{npx json-server --watch db.json --port 5000 }in your terminal.


Run React App:

Run the React app with npm start.

5. Expected Features:

Add Task: Adds a new task to the list and updates the JSON Server.

Edit Task: Allows editing an existing task.

Delete Task: Deletes a task from the list and from JSON Server.

Mark as Completed: Toggle task completion status.

Responsive UI: The app is responsive and works well on mobile devices.

