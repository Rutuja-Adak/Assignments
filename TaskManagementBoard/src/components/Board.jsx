
import Column from "./Column";
import TaskForm from "./TaskForm";

const statuses = ["To Do", "In Progress", "Done"];

function Board({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onUpdateStatus,
}) {
  return (
    <main>
      <TaskForm onAddTask={onAddTask} />

      <div className="board">
        {statuses.map((status) => (
          <Column
            key={status}
            status={status}
            tasks={tasks.filter(
              (task) => task.status === status
            )}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onUpdateStatus={onUpdateStatus}
          />
        ))}
      </div>
    </main>
  );
}

export default Board;
