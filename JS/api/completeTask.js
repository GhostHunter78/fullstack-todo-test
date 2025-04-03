import { getFilteredTasks } from "./getTasks.js";

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
        getFilteredTasks();
        if (!response.ok) throw new Error("Failed to update task");
        taskElement.classList.add("completed");
        taskElement.style.backgroundColor = "lightgreen";
    } catch (error) {
        console.error("Error updating task:", error);
    }
}
