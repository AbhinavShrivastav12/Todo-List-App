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
      <div className='btn'>
      <button onClick={() => editTask(task.id, task.text)}>Edit</button>
      <button onClick={() => deleteTask(task.id)}>Delete</button>
      </div>
    </div>
  );
}

export default TodoItem;
