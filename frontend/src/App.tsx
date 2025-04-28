import React, { useEffect, useState } from 'react';
import './App.css';

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

const API = "http://localhost:5000";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const fetchTasks = async () => {
    const res = await fetch(`${API}/tasks`);
    const data = await res.json();
    setTasks(data);
  };

  const addTask = async () => {
    if (!text.trim()) return;
    await fetch(`${API}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    setText("");
    fetchTasks();
  };

  const toggleTask = async (id: number) => {
    await fetch(`${API}/tasks/${id}`, { method: "PUT" });
    fetchTasks();
  };

  const deleteTask = async (id: number) => {
    await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className={darkMode ? 'container dark' : 'container'}>
      <div className="card">
        <header>
          <h1>📝 TaskFlow</h1>
          <button
            className="mode-toggle"
            onClick={() => setDarkMode((m) => !m)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '🌞' : '🌙'}
          </button>
        </header>

        <div className="input-row">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter a new task..."
          />
          <button onClick={addTask}>Add</button>
        </div>

        <ul className="task-list">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={task.completed ? 'completed fade-in' : 'fade-in'}
            >
              <span onClick={() => toggleTask(task.id)}>{task.text}</span>
              <button onClick={() => deleteTask(task.id)}>❌</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
