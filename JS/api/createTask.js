import { getTasksData, displayTasks } from "./getTasks.js";

export async function createTask() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. User may not be authenticated.");
    return;
  }

  const taskTitle = document.getElementById("create-task-input").value;
  const taskPriority = document.getElementById("task-priority-select").value;

  if (!taskTitle || !taskPriority) {
    console.error("Task title and priority are required.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ task: taskTitle, priority: taskPriority }),
    });

    if (!response.ok) throw new Error("Failed to create task");

    document.getElementById("create-task-input").value = "";

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

    console.log("Task created successfully");
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

document
  .getElementById("create-task-button")
  .addEventListener("click", createTask);
