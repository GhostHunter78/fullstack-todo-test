import { backupTaskStatus } from "./backupTaskStatus.js";
import { completeTask } from "./completeTask.js";
import { deleteTask } from "./deleteTask.js";
import { editTaskData } from "./editTaskData.js";

window.tasksData = [];

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

    window.tasksData = await response.json();
    console.log("tasks:", window.tasksData);

    displayTasks(window.tasksData);

    const completedTasks = window.tasksData.filter(
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

  let currentEditBox = null;

  document.querySelectorAll(".edit-icon").forEach((icon) => {
    icon.addEventListener("click", async (event) => {
      event.stopPropagation();
      if (currentEditBox) {
        currentEditBox.parentElement.removeChild(currentEditBox);
        currentEditBox = null;
      }

      const taskElement = event.target.closest(".task");
      const editBox = document.createElement("div");
      editBox.classList.add("edit-box");
      editBox.innerHTML = `
      <div class="edit-box-inputs-div">
        <input id="edit-taskName-input" type="text" class="edit-input" placeholder="Edit task name" required />
        <input id="edit-taskPriority-input" type="number" class="edit-input" placeholder="Edit task priority" required />
        </div>
        <div class="icons-div">
        <img alt="save task" class="icon save-icon" src="./icons/save-svgrepo-com.svg" />
        <img alt="cancel" class="icon cancel-icon" src="./icons/cancel-svgrepo-com.svg" />
          </div>
      `;
      taskElement.appendChild(editBox);
      currentEditBox = editBox;

      const taskId = taskElement.getAttribute("data-id");
      const saveIcon = editBox.querySelector(".save-icon");
      const cancelIcon = editBox.querySelector(".cancel-icon");

      editBox.addEventListener("click", (e) => {
        e.stopPropagation();
      });

      cancelIcon.addEventListener("click", () => {
        taskElement.removeChild(editBox);
        currentEditBox = null;
      });

      saveIcon.addEventListener("click", () => {
        const editTaskNameInput = editBox.querySelector("#edit-taskName-input");
        const editedTaskName = editTaskNameInput.value;
        const editTaskPriorityInput = editBox.querySelector(
          "#edit-taskPriority-input"
        );
        const editedTaskPriority = editTaskPriorityInput.value;

        editTaskData(taskId, editedTaskPriority, editedTaskName);

        setTimeout(() => {
          if (editBox.parentElement) {
            taskElement.removeChild(editBox);
            currentEditBox = null;
          }
        }, 1000);
      });
    });
  });

  document.addEventListener("click", () => {
    if (currentEditBox && currentEditBox.parentElement) {
      currentEditBox.parentElement.removeChild(currentEditBox);
      currentEditBox = null;
    }
  });

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
  const savedFilter = localStorage.getItem("selectedFilter") || "All";

  filterSelect.value = savedFilter;

  filterByButton.addEventListener("click", () => {
    motherDiv.classList.toggle("hidden");
  });

  filterApplyButton.addEventListener("click", () => {
    const selectedFilter = filterSelect.value;

    localStorage.setItem("selectedFilter", selectedFilter);

    if (selectedFilter === "All") {
      displayTasks(window.tasksData);
    } else {
      displayTasks(
        window.tasksData.filter((task) => task.priority === selectedFilter)
      );
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await getTasksData();

  const savedFilter = localStorage.getItem("selectedFilter") || "All";
  if (savedFilter !== "All") {
    displayTasks(
      window.tasksData.filter((task) => task.priority === savedFilter)
    );
  }

  getFilteredTasks();
});
