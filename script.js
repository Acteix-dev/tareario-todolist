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

    const newTaskDragHandler = document.createElement("div");
    newTaskDragHandler.classList.add("task-drag-handler");
    newTaskDragHandler.setAttribute("draggable", "true");

    const newTaskDeleteButton = document.createElement("button");
    newTaskDeleteButton.classList.add("task-delete-btn");
    newTaskDeleteButton.type = "button";

    const newTaskDescription = document.createElement("p");
    newTaskDescription.classList.add("task-desc");
    newTaskDescription.classList.add("empty-description");
    newTaskDescription.setAttribute("draggable", "true");

    if (task.taskDescription.trim() !== "") {
      newTaskDescription.textContent = task.taskDescription;
      newTaskDescription.classList.remove("empty-description");
    } else {
      newTaskDescription.textContent = "";
    }

    // GET THE TASKS CONTAINER ELEMENT
    const tasksContainer = document.getElementById("tasks-container");
    // ADD EVENT LISTENERS TO THE CHILDS
    tasksContainer.addEventListener("click", function (event) {
      const taskElement = event.target.closest(".single-task-container");

      if (event.target.classList.contains("task-delete-btn")) {
        taskElement.remove();
        tasks = tasks.filter((t) => t.taskId !== taskElement.id);
        updateLocalStorage();
      } else if (event.target.classList.contains("task-desc")) {
        event.target.setAttribute("contenteditable", "true");
        event.target.focus();
      }
    });

    // HANDLE INPUT EVENTS
    tasksContainer.addEventListener("input", function (event) {
      const taskElement = event.target.closest(".single-task-container");
      if (!taskElement) return;

      const task = tasks.find((task) => task.taskId === taskElement.id);

      if (event.target.classList.contains("task-title")) {
        task.taskTitle = event.target.textContent.trim();
      } else if (event.target.classList.contains("task-desc")) {
        const description = event.target.innerText.trim();
        if (description === "") {
          event.target.classList.add("empty-description");
          event.target.innerHTML = "";
        } else {
          event.target.classList.remove("empty-description");
        }
        task.taskDescription = description;
      }
      updateLocalStorage();
    });

    document.getElementById("tasks-container").appendChild(newTaskContainer);
    newTaskContainer.appendChild(newTaskTitleRow);
    newTaskTitleRow.appendChild(newTaskDeleteButton);
    newTaskTitleRow.appendChild(newTaskDragHandler);
    newTaskTitleRow.appendChild(newTaskTitle);
    newTaskContainer.appendChild(newTaskDescription);

    addDragEvents(newTaskContainer);
    addDragoverEvents(newTaskContainer);
    addDropSwitchEvents(newTaskContainer);
    addPreventDrag(newTaskDescription);

    function updateLocalStorage() {
      window.localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }

  const toggleSidebar = document.querySelector("#sidebar-toggle-btn");
  toggleSidebar.addEventListener("click", function (event) {
    const sidebar = document.querySelector("aside");
    sidebar.classList.toggle("toggled");
  });

  tasks.forEach((task) => createTaskElement(task));
});
