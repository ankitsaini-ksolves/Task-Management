import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, updateTaskStatus } from "../redux/taskSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);
  const tasks = useSelector((state) => state.tasks.tasks);
  const status = useSelector((state) => state.tasks.status);
  const error = useSelector((state) => state.tasks.error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks(userId));
    }
  }, [dispatch, status]);

  const handleStatusChange = (taskId, currentStatus) => {
    const newStatus =
      currentStatus === "pending"
        ? "in progress"
        : currentStatus === "in progress"
        ? "completed"
        : "pending";
    dispatch(updateTaskStatus({userId, taskId, status: newStatus }));
  };

  return (
    <div className="container mt-5 p-4 rounded shadow-sm bg-light">
      <h3 className="text-center mb-4">Today's Tasks</h3>
      {status === "loading" && (
        <div className="text-center text-secondary">Loading tasks...</div>
      )}
      {status === "failed" && (
        <div className="text-center text-danger">Error: {error}</div>
      )}
      {status === "succeeded" && tasks.length === 0 && (
        <div className="text-center text-secondary">No tasks for today!</div>
      )}
      <ul className="list-group">
        {tasks.map((task) => (
          <li
            className="list-group-item d-flex justify-content-between align-items-center"
            key={task._id}
          >
            <div>
              <strong>{task.title}</strong>
              <br />
              <small className="text-muted">
                {task.startTime} - {task.endTime}
              </small>
              <br />
              <span
                className={`badge bg-${
                  task.status === "completed"
                    ? "success"
                    : task.status === "in progress"
                    ? "primary"
                    : "secondary"
                } mt-2`}
              >
                {task.status}
              </span>
            </div>
            <div>
              <p>{task.date}</p>
              {task.status !== "completed" && (
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => handleStatusChange(task._id, task.status)}
                >
                  {task.status === "pending" ? "Start" : "Complete"}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
