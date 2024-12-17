import React from "react";

const TaskForm = ({
  taskNumber,
  task,
  handleTaskChange,
  validationMessages,
}) => {
  return (
    <div className="mb-3">
      <h5>Task {taskNumber}</h5>
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          className="form-control"
          value={task.title}
          onChange={(e) =>
            handleTaskChange(taskNumber - 1, "title", e.target.value)
          }
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          className="form-control"
          rows="3"
          value={task.description}
          onChange={(e) =>
            handleTaskChange(taskNumber - 1, "description", e.target.value)
          }
        />
      </div>
      <div className="container">
        <div className="row">
          <div className="form-group col">
            <label>Start Time</label>
            <input
              type="time"
              className="form-control"
              value={task.startTime}
              onChange={(e) => {
                    handleTaskChange(taskNumber - 1, "startTime", e.target.value);
              }}
            />
            {validationMessages.startTime && (
              <small className="text-danger">
                {validationMessages.startTime}
              </small>
            )}
          </div>
          <div className="form-group col">
            <label>End Time</label>
            <input
              type="time"
              className="form-control"
              value={task.endTime}
              onChange={(e) => {
                  handleTaskChange(taskNumber - 1, "endTime", e.target.value);
              }}
            />
            {validationMessages.endTime && (
              <small className="text-danger">
                {validationMessages.endTime}
              </small>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
