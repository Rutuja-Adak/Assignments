
import TaskCard from "./TaskCard";

function Column({
  status,
  tasks,
  onEditTask,
  onDeleteTask,
  onUpdateStatus,
}) {
  return (
    <section className={`column column-${status.toLowerCase().replace(" ", "-")}`}>
      <div className="column-header">
        <h2>{status}</h2>
        <span className="task-count">{tasks.length}</span>
      </div>

      <div className="task-list">
        {tasks.length === 0 ? (
          <p className="empty-message">No tasks yet</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onUpdateStatus={onUpdateStatus}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default Column;
