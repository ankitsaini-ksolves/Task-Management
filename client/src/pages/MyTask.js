import React, { useState, useEffect } from "react";
import TaskForm from "../components/TaskForm";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addTask } from "../redux/taskSlice";
import Modal from "../components/Modal";

const API_URL = process.env.REACT_APP_BASE_URL;

const MyTask = () => {
  const userId = useSelector((state) => state.auth.user.userId);
  const dispatch = useDispatch();

  const [dates, setDates] = useState([]);
  const [tasks, setTasks] = useState({});
  const [expandedDate, setExpandedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [newTasks, setNewTasks] = useState([
    { title: "", description: "", time: "" },
  ]);
  const [validationMessages, setValidationMessages] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchTaskDates();
    }
  }, [userId]);

  async function fetchTaskDates() {
    try {
      const response = await fetch(`${API_URL}/tasks/dates/${userId}`, {
        method: "GET",
      });

      const data = await response.json();
      setDates(data || []);
    } catch (error) {
      console.error("Failed to fetch task dates:", error);
    }
  }

  const openEditModal = (task) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  };

  const handleExpand = async (date) => {
    if (!tasks[date]) {
      try {
        const response = await fetch(`${API_URL}/tasks/${userId}/${date}`, {
          method: "GET",
        });

        const data = await response.json();
        const tasksForDate = data?.tasks || [];
        setTasks((prev) => ({ ...prev, [date]: tasksForDate }));
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    }

    setExpandedDate(expandedDate === date ? null : date);
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the task");
      }

      setTasks((prev) => {
        const updatedTasks = { ...prev };
        updatedTasks[expandedDate] = updatedTasks[expandedDate].filter(
          (t) => t._id !== taskId
        );
        toast.error("Task deleted Successfully", {
          autoClose: 2000,
        });

        return updatedTasks;
      });
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };

const handleEditTask = async () => {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskToEdit._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        date: selectedDate,
        ...taskToEdit,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error) {
        toast.error(errorData.error, { autoClose: 2000 });
        return;
      }
    }

    const { tasks: updatedTasks, date } = await response.json();

    // Use the date from the response to update the tasks state
    setTasks((prev) => ({
      ...prev,
      [date]: updatedTasks,
    }));

    setIsEditModalOpen(false);
    toast.success("Task updated successfully", { autoClose: 2000 });
  } catch (error) {
    console.error("Error editing task:", error.message);
    toast.error("Failed to update task", { autoClose: 2000 });
  }
};


  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...newTasks];
    updatedTasks[index][field] = value;

    const messages = { ...validationMessages[index] };
    const startTime = updatedTasks[index].startTime;
    const endTime = updatedTasks[index].endTime;

    messages.startTime = "";
    messages.endTime = "";

    // Start and End Time Validation
    if (field === "endTime" && startTime && value <= startTime) {
      messages.endTime = "End time must be greater than start time.";
    } else if (field === "startTime" && endTime && value >= endTime) {
      messages.startTime = "Start time must be less than end time.";
    }

    const isOverlapping = (task, i) => {
      if (i !== index) {
        const taskStartTime = task.startTime;
        const taskEndTime = task.endTime;

        return startTime < taskEndTime && endTime > taskStartTime;
      }
      return false;
    };

    const hasOverlapWithNewTasks = updatedTasks.some(isOverlapping);
    const hasOverlapWithSavedTasks =
      tasks[selectedDate]?.some((task) => {
        const savedStartTime = task.startTime;
        const savedEndTime = task.endTime;
        return startTime < savedEndTime && endTime > savedStartTime;
      }) || false;

    if (hasOverlapWithNewTasks || hasOverlapWithSavedTasks) {
      messages.startTime = "Time overlaps with another task.";
      messages.endTime = "Time overlaps with another task.";
    }

    const updatedMessages = [...validationMessages];
    updatedMessages[index] = messages;

    setNewTasks(updatedTasks);
    setValidationMessages(updatedMessages);
  };

  const resetModal = () => {
    setNewTasks([{ title: "", description: "", startTime: "", endTime: "" }]);
    setValidationMessages([]);
    setSelectedDate("");
    setShowModal(false);
  };

  const handleSaveTasks = async () => {
    if (!selectedDate || !newTasks.length) {
      toast.error("Please select the date", { autoClose: 2000 });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          date: selectedDate,
          tasks: newTasks,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error && errorData.taskIndex !== undefined) {
          const updatedMessages = [...validationMessages];
          const index = errorData.taskIndex;

          if (!updatedMessages[index]) {
            updatedMessages[index] = {};
          }

          updatedMessages[index].startTime = errorData.error;
          updatedMessages[index].endTime = errorData.error;

          setValidationMessages(updatedMessages);
        }
        return;
      }

      const result = await response.json();
      setDates((prev) => [...new Set([...prev, selectedDate])]);
      setTasks((prev) => ({
        ...prev,
        [selectedDate]: result.tasks,
      }));

      const today = new Date().toISOString().split("T")[0];
      if (selectedDate === today) {
        dispatch(addTask(result.tasks));
      }
      resetModal();
      setShowModal(false);
      toast.success("Task added Successfully", { autoClose: 2000 });
    } catch (error) {
      console.error("Error saving tasks:", error.message);
    }
  };

  const addNewTask = () => {
    setNewTasks((prevTasks) => [
      ...prevTasks,
      { title: "", description: "", startTime: "", endTime: "" },
    ]);
    setValidationMessages((prevMessages) => [
      ...prevMessages,
      { startTime: "", endTime: "" },
    ]);
  };

  const deleteTask = (index) => {
    const updatedTasks = [...newTasks];
    updatedTasks.splice(index, 1);
    setNewTasks(updatedTasks);
  };

  const formatTo12HourTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number); // Split and parse time components
    const period = hours >= 12 ? "PM" : "AM"; // Determine AM/PM
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div className="container my-4">
      <h3>My Tasks</h3>
      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowModal(true)}
      >
        Add Task
      </button>
      <div className="accordion" id="taskAccordion">
        {dates.map((date, index) => (
          <div className="accordion-item mb-2" key={index}>
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                type="button"
                onClick={() => handleExpand(date)}
                aria-expanded={expandedDate === date}
              >
                {date}
              </button>
            </h2>
            <div
              className={`accordion-collapse collapse ${
                expandedDate === date ? "show" : ""
              }`}
            >
              <div className="accordion-body">
                {tasks[date] ? (
                  tasks[date].map((task) => (
                    <div
                      className="d-flex align-items-center mb-2"
                      key={task._id}
                    >
                      <div className="flex-grow-1">
                        <strong>{task.title}</strong>
                        <span className="ms-5">
                          Start Time: {formatTo12HourTime(task.startTime)}
                        </span>
                        <small className="ms-5">
                          End Time: {formatTo12HourTime(task.endTime)}
                        </small>
                      </div>
                      <button
                        className="btn btn-danger btn-sm me-2"
                        onClick={() => handleDelete(task._id)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEditModal(task)}
                      >
                        Edit
                      </button>
                      {/* <button
                        className="btn btn-link"
                        data-bs-toggle="collapse"
                        data-bs-target={`#desc-${task._id}`}
                      >
                        Details
                      </button> */}
                      <div id={`desc-${task._id}`} className="collapse mt-2">
                        {task.description}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Loading tasks...</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Tasks</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-group mb-3">
                  <label>Select Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                {selectedDate &&
                  newTasks.map((task, index) => (
                    <div key={index}>
                      <TaskForm
                        taskNumber={index + 1}
                        task={task}
                        handleTaskChange={handleTaskChange}
                        validationMessages={validationMessages[index] || {}}
                      />
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteTask(index)}
                      >
                        Delete Task
                      </button>
                    </div>
                  ))}
                <button className="btn btn-secondary mt-2" onClick={addNewTask}>
                  + Add More Task
                </button>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleSaveTasks}>
                  Save Tasks
                </button>
                <button className="btn btn-secondary" onClick={resetModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isEditModalOpen && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <h3>Edit Task</h3>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              value={taskToEdit.title}
              onChange={(e) =>
                setTaskToEdit((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={taskToEdit.description}
              onChange={(e) =>
                setTaskToEdit((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>
          <div className="row">
            <div className="col">
              <label>Start Time</label>
              <input
                type="time"
                className="form-control"
                value={taskToEdit.startTime}
                onChange={(e) =>
                  setTaskToEdit((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                  }))
                }
              />
            </div>
            <div className="col">
              <label>End Time</label>
              <input
                type="time"
                className="form-control"
                value={taskToEdit.endTime}
                onChange={(e) =>
                  setTaskToEdit((prev) => ({
                    ...prev,
                    endTime: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <button className="btn btn-primary mt-3" onClick={handleEditTask}>
            Save
          </button>
        </Modal>
      )}
    </div>
  );
};

export default MyTask;
