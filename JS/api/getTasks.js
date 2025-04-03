import { backupTaskStatus } from "./backupTaskStatus.js";
import { completeTask } from "./completeTask.js";
import { deleteTask } from "./deleteTask.js";

let tasksData = [];

export async function getTasksData() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token found. User may not be authenticated.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/tasks", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        tasksData = await response.json();
        console.log("tasks:", tasksData);

        displayTasks(tasksData);

        const completedTasks = tasksData.filter(
            (task) => task.completed === false
        );

        const description = document.getElementById("description");
        description.innerHTML = `
        <h4>You have <span style="color: red">${completedTasks.length}</span> uncompleted tasks for today!</h4>
        `;
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

export function displayTasks(tasks) {
    const tasksContainer = document.getElementById("tasks-container");

    if (!tasks || tasks.length === 0) {
        tasksContainer.innerHTML = "<p>No tasks available.</p>";
        return;
    }

    tasksContainer.innerHTML = tasks
        .map(
            (task) => `
                <div class="task ${
                    task.completed ? "completed" : ""
                }" data-id="${task._id}">
                <div>
                    <h3><span class="bold">Task name: </span>${task.task}</h3>
                    <p><span class="bold">Task priority: </span>${
                        task.priority
                    }</p>
                    </div>
                    <div class="icons-div">
                    <img class="icon edit-icon" src="./icons/edit-2-svgrepo-com.svg" /> 
                        ${
                            task.completed
                                ? `<img class="icon backup-icon" src="./icons/backup-svgrepo-com.svg" />`
                                : `<img class="icon check-icon" src="./icons/check-svgrepo-com.svg" />`
                        }
                        <img class="icon delete-icon" src="./icons/delete-svgrepo-com.svg" />   
                    </div>
                </div>
            `
        )
        .join("");

    document.querySelectorAll(".check-icon").forEach((icon) => {
        icon.addEventListener("click", async (event) => {
            const taskElement = event.target.closest(".task");
            const taskId = taskElement.getAttribute("data-id");

            await completeTask(taskId, taskElement);
        });
    });

    document.querySelectorAll(".backup-icon").forEach((icon) => {
        icon.addEventListener("click", async (event) => {
            const taskElement = event.target.closest(".task");
            const taskId = taskElement.getAttribute("data-id");

            await backupTaskStatus(taskId, taskElement);
        });
    });

    document.querySelectorAll(".delete-icon").forEach((icon) => {
        icon.addEventListener("click", async (event) => {
            const taskElement = event.target.closest(".task");
            const taskId = taskElement.getAttribute("data-id");

            await deleteTask(taskId);
        });
    });
}

// function to filter tasks by their priority
export function getFilteredTasks() {
    const motherDiv = document.getElementById("filter-div");
    const filterByButton = document.getElementById("filter-button");
    const filterSelect = document.getElementById("filter-select");
    const filterApplyButton = document.getElementById("filter-apply-button");

    filterByButton.addEventListener("click", () => {
        motherDiv.classList.toggle("hidden");
    });

    filterApplyButton.addEventListener("click", () => {
        const selectedFilter = filterSelect.value;

        localStorage.setItem("selectedFilter", selectedFilter);

        if (selectedFilter === "All") {
            displayTasks(tasksData);
        } else {
            displayTasks(
                tasksData.filter((task) => task.priority === selectedFilter)
            );
        }
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    await getTasksData();

    const savedFilter = localStorage.getItem("selectedFilter") || "All";
    if (savedFilter !== "All") {
        displayTasks(tasksData.filter((task) => task.priority === savedFilter));
    }

    getFilteredTasks();
});

// function to sort tasks by their creation date
export async function sortTasks() {
    const motherDiv = document.getElementById("sort-div");
    const sortByButton = document.getElementById("sort-button");
    const sortSelect = document.getElementById("sort-select");
    const sortApplyButton = document.getElementById("sort-apply-button");

    sortByButton.addEventListener("click", () => {
        motherDiv.classList.toggle("hidden");
    });
}
