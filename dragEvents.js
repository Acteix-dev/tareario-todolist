export function addDragEvents(element) {
  element.setAttribute("draggable", "true");

  element.addEventListener("dragstart", function (event) {
    const container = event.target.closest(".single-task-container");
    event.dataTransfer.setData("text/plain", container.id);
    event.dataTransfer.effectAllowed = "move";
  });

  element.addEventListener("dragend", function (event) {
    event.preventDefault();
  });
}

export function addDragoverEvents(element) {
  element.addEventListener("dragover", function (event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  });

  element.addEventListener("dragenter", function (event) {
    event.preventDefault();
    event.currentTarget.classList.add("dragged-over");
  });

  element.addEventListener("dragleave", function (event) {
    event.preventDefault();
    event.currentTarget.classList.remove("dragged-over");
  });
}

export function addDropSwitchEvents(element) {
  element.addEventListener("drop", function (event) {
    event.preventDefault();

    const draggedElementId = event.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(draggedElementId);
    const dropTarget = event.currentTarget.closest(".single-task-container");

    if (draggedElement && dropTarget && draggedElement !== dropTarget) {
      let tasks = JSON.parse(window.localStorage.getItem("tasks"))
      
      let draggedIndex = tasks.findIndex(task => task.taskId === draggedElementId);
      let targetIndex = tasks.findIndex(task => task.taskId === dropTarget.id);
      [tasks[draggedIndex], tasks[targetIndex]] = [tasks[targetIndex], tasks[draggedIndex]];
      window.localStorage.setItem("tasks", JSON.stringify(tasks));
      
      const parent = dropTarget.parentNode;

      const draggedRect = draggedElement.getBoundingClientRect();
      const targetRect = dropTarget.getBoundingClientRect();
      console.log(targetRect.top);

      const deltaY = targetRect.bottom - draggedRect.bottom;  

      draggedElement.style.transition = "transform 0.3s ease";
      draggedElement.style.transform = `translateY(${deltaY}px)`;
      draggedElement.style.zIndex = `1`;
      dropTarget.style.transition = "opacity 0.3s ease";
      dropTarget.style.opacity = "0";

      setTimeout(() => {
        draggedElement.style.transition = "";
        draggedElement.style.transform = "";
        draggedElement.style.zIndex = `0`;
        dropTarget.style.opacity = "1";

        const draggedNext = draggedElement.nextSibling;
        parent.insertBefore(draggedElement, dropTarget.nextSibling);
        parent.insertBefore(dropTarget, draggedNext);
      }, 300);
    }

    dropTarget.classList.remove("dragged-over");

  });
}

export function addPreventDrag(element) {
  element.addEventListener("dragstart", function (event) {
    event.preventDefault();
    event.stopPropagation();
  });
}
