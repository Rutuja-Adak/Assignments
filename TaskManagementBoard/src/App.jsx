
import { useEffect, useState } from "react";
import Board from "./components/Board";
import "./App.css";

const initialTasks = [
  {
    id: 1,
    title: "Learn React",
    description: "Practise components and hooks",
    status: "To Do",
  },
  {
    id: 2,
    title: "Build a UI",
    description: "Create a responsive task board",
    status: "In Progress",
  },
  {
    id: 3,
    title: "Setup project",
    description: "Create the React application",
    status: "Done",
  },
];

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("tasks");

      return savedTasks === null
        ? initialTasks
        : JSON.parse(savedTasks);
    } catch {
      return initialTasks;
    }
  });

  // Save tasks whenever the array changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Create a task
  function addTask(title, description) {
    const newTask = {
      id: crypto.randomUUID(),
      title,
      description,
      status: "To Do",
    };

    setTasks((previousTasks) => [...previousTasks, newTask]);
  }

  // Edit a task
  function editTask(id, title, description) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? { ...task, title, description }
          : task
      )
    );
  }

  // Delete a task
  function deleteTask(id) {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== id)
    );
  }

  // Change task status
  function updateStatus(id, status) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Management Board</h1>
        <p>Organize your work, one task at a time.</p>
      </header>

      <Board
        tasks={tasks}
        onAddTask={addTask}
        onEditTask={editTask}
        onDeleteTask={deleteTask}
        onUpdateStatus={updateStatus}
      />
    </div>
  );
}

export default App;
