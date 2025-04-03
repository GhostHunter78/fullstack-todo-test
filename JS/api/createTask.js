import { getFilteredTasks } from "./getTasks.js";

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
        document.getElementById("create-task-input").value = "";
        getFilteredTasks();

        if (!response.ok) throw new Error("Failed to create task");
        console.log("Task created successfully");
    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
}
document
    .getElementById("create-task-button")
    .addEventListener("click", createTask);
