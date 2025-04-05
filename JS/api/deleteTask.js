import { displayTasks, getTasksData } from "./getTasks.js";

export async function deleteTask(taskId) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    await getTasksData();

    const savedFilter = localStorage.getItem("selectedFilter") || "All";
    if (savedFilter === "All") {
      getTasksData;
    } else {
      const filteredTasks = window.tasksData.filter(
        (task) => task.priority === savedFilter
      );
      displayTasks(filteredTasks);
    }
    if (!response.ok) throw new Error("Failed to delete task");
    console.log("Task deleted successfully");
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}
