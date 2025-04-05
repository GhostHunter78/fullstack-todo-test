import { getTasksData, displayTasks } from "./getTasks.js";

export async function completeTask(taskId, taskElement) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: true }),
    });

    if (!response.ok) throw new Error("Failed to update task");

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

    taskElement.classList.add("completed");
    taskElement.style.backgroundColor = "lightgreen";
  } catch (error) {
    console.error("Error updating task:", error);
  }
}
