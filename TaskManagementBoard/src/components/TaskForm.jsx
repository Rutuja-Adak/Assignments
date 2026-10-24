
import { useState } from "react";

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) return;

    onAddTask(title.trim(), description.trim());

    setTitle("");
    setDescription("");
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>Add a New Task</h2>

      <input
        type="text"
        placeholder="Enter task title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />

      <textarea
        placeholder="Enter task description"
        value={description}
        onChange={(event) =>
          setDescription(event.target.value)
        }
      />

      <button type="submit">+ Add Task</button>
    </form>
  );
}

export default TaskForm;
