import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5001/api/tasks", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(response => {
      setTasks(response.data.tasks);
      setLoading(false);
    })
    .catch(error => {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks. Please try again.");
      setLoading(false);
    });
  }, []);

  const handleUpdateStatus = (taskId, newStatus) => {
    axios.patch(`http://localhost:5001/api/tasks/${taskId}/status`, { status: newStatus }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(response => {
      setTasks(prevTasks => prevTasks.map(task =>
        task._id === taskId ? { ...task, status: newStatus } : task
      ));
    })
    .catch(error => console.error("❌ Error updating task:", error));
  };

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Task Dashboard</h2>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            {task.title} - {task.status}
            {task.status !== "completed" && (
              <button onClick={() => handleUpdateStatus(task._id, "completed")}>
                ✅ Complete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;