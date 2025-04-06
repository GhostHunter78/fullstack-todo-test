import { displayTasks, getTasksData } from "./getTasks.js";

export async function editTaskData(taskId, editedTaskPriority, editedTaskName) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task: editedTaskName,
        priority: editedTaskPriority,
      }),
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

    if (!response.ok) throw new Error("Failed to update task");
  } catch (error) {
    console.error("Error updating task:", error);
  }
}
