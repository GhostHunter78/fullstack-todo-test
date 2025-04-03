import { getFilteredTasks } from "./getTasks.js";

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
        getFilteredTasks();
        if (!response.ok) throw new Error("Failed to delete task");
        console.log("Task deleted successfully");
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}
