
import { useState } from "react";

function TaskCard({
  task,
  onEditTask,
  onDeleteTask,
  onUpdateStatus,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(
    task.description
  );

  function handleSave(event) {
    event.preventDefault();

    if (!title.trim()) return;

    onEditTask(
      task.id,
      title.trim(),
      description.trim()
    );

    setIsEditing(false);
  }

  function handleCancel() {
    setTitle(task.title);
    setDescription(task.description);
    setIsEditing(false);
  }

  return (
    <article className="task-card">
      {isEditing ? (
        <form onSubmit={handleSave}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Task title"
            required
            aria-label="Edit task title"
          />

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Task description"
            aria-label="Edit task description"
          />

          <div className="card-actions">
            <button type="submit">Save</button>
            <button type="button" className="secondary"
              onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <h3>{task.title}</h3>
          <p className="task-description">
            {task.description || "No description"}
          </p>

          <label className="status-label">
            Status
            <select
              value={task.status}
              onChange={(event) =>
                onUpdateStatus(task.id, event.target.value)
              }
              aria-label={`Status for ${task.title}`}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </label>

          <div className="card-actions">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>

            <button
              type="button"
              className="delete-button"
              onClick={() => {
                if (window.confirm("Delete this task?")) {
                  onDeleteTask(task.id);
                }
              }}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </article>
  );
}

export default TaskCard;
