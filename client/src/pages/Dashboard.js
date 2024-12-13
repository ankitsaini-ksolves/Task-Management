import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../redux/taskSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const status = useSelector((state) => state.tasks.status);
  const error = useSelector((state) => state.tasks.error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks());
    }
  }, [dispatch, status]);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Today's Tasks</h2>
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p className="text-danger">{error}</p>}
      {tasks.map((task) => (
        <div className="card mb-3 shadow" key={task.id}>
          <div className="card-body">
            <h5 className="card-title">{task.name}</h5>
            <p className="card-text">{task.description}</p>
            <p>
              <strong>Timer:</strong> {task.timer}
            </p>
            <p>
              <strong>Status:</strong> {task.status}
            </p>
            <div>
              <button className="btn btn-success me-2">Start</button>
              <button className="btn btn-warning me-2">Pause</button>
              <button className="btn btn-primary">Complete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
