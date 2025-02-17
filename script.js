import {
  addDragEvents,
  addDragoverEvents,
  addDropSwitchEvents,
  addPreventDrag,
} from "./dragEvents.js";

document.addEventListener("DOMContentLoaded", function () {
  let tasks = JSON.parse(window.localStorage.getItem("tasks")) || [];

  const addTaskButton = document.getElementById("add-task-btn");

  addTaskButton.addEventListener("click", function () {
    const title = document.getElementById("add-title-input").value.trim();
    const desc = document.getElementById("add-desc-input").innerText;
    const prio = document.getElementById("priority-select").value;

    if (title === "") return;

    if (tasks.some((task) => task.taskTitle === title)) {
      alert("No se pueden guardar dos tareas con el mismo título.");
      return;
    }

    const task = {
      taskId: Date.now().toString(),
      taskTitle: title,
      taskDescription: desc,
      taskPriority: prio,
      taskCompleted: false,
    };

    tasks.push(task);
    window.localStorage.setItem("tasks", JSON.stringify(tasks));

    createTaskElement(task);
    document.getElementById("add-title-input").value = "";
    document.getElementById("add-desc-input").textContent = "";
  });

  function createTaskElement(task) {
    const newTaskContainer = document.createElement("div");
    newTaskContainer.classList.add("single-task-container", "drop-target");
    if (task.taskPriority) newTaskContainer.classList.add(task.taskPriority);
    newTaskContainer.id = task.taskId;

    const newTaskTitleRow = document.createElement("div");
    newTaskTitleRow.classList.add("task-title-row");

    const newTaskTitle = document.createElement("span");
    newTaskTitle.classList.add("task-title");
    newTaskTitle.setAttribute("contenteditable", "true");
    newTaskTitle.textContent = task.taskTitle;

    newTaskTitle.addEventListener("input", function (event) {
      let data = this.textContent.trim();
      const parentTaskId = event.target.closest(".single-task-container").id;

      if (data !== "") {
        tasks.forEach((task) => {
          if (task.taskId === parentTaskId) {
            task["taskTitle"] = data;
          }
          window.localStorage.setItem("tasks", JSON.stringify(tasks));
        });
      }
    });

    const newTaskDragHandler = document.createElement("div");
    newTaskDragHandler.classList.add("task-drag-handler");
    newTaskDragHandler.setAttribute("draggable", "true");

    const newTaskDeleteButton = document.createElement("button");
    newTaskDeleteButton.classList.add("task-delete-btn");
    newTaskDeleteButton.type = "button";
    newTaskDeleteButton.addEventListener("click", function () {
      newTaskContainer.remove();
      tasks = tasks.filter((t) => t.taskId !== task.taskId);
      window.localStorage.setItem("tasks", JSON.stringify(tasks));
    });

    const newTaskDescription = document.createElement("p");
    newTaskDescription.classList.add("task-desc");
    newTaskDescription.classList.add("empty-description");
    newTaskDescription.setAttribute("draggable", "true");
    if (task.taskDescription.length === 1 || task.taskDescription === "<br>" || task.taskDescription === " ") {
      newTaskDescription.innerHtml = "";
    } else {
      newTaskDescription.innerHTML = task.taskDescription;
    }

    newTaskDescription.addEventListener("click", function (event) {
      event.target.setAttribute("contenteditable", "true");
      event.target.focus();
    });

    newTaskDescription.addEventListener("input", function (event) {
      let data = this.innerText;
      const parentTaskId = event.target.closest(".single-task-container").id;

      tasks.forEach((task) => {
        if (task.taskId === parentTaskId) {
          task["taskDescription"] = data;
        }
      });

      window.localStorage.setItem("tasks", JSON.stringify(tasks));
    });

    document.getElementById("tasks-container").appendChild(newTaskContainer);
    newTaskContainer.appendChild(newTaskTitleRow);
    newTaskTitleRow.appendChild(newTaskDeleteButton);
    newTaskTitleRow.appendChild(newTaskDragHandler);
    newTaskTitleRow.appendChild(newTaskTitle);
    newTaskContainer.appendChild(newTaskDescription);

    // Attach drag and drop events
    addDragEvents(newTaskContainer);
    addDragoverEvents(newTaskContainer);
    addDropSwitchEvents(newTaskContainer);
    addPreventDrag(newTaskDescription);
  }

  const toggleSidebar = document.querySelector("#sidebar-toggle-btn");
  toggleSidebar.addEventListener("click", function (event) {
    const sidebar = document.querySelector("aside");
    sidebar.classList.toggle("toggled");
  });

  tasks.forEach((task) => createTaskElement(task));
});
