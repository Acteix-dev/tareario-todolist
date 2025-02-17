export function addDragDropSwitchEvents(element) {
  element.addEventListener("dragstart", function (event) {
    const container = event.target.closest(".single-task-container");
    event.dataTransfer.setData("text/plain", container.id);
    event.dataTransfer.effectAllowed = "move";
    container.classList.remove("drop-target");
    container.classList.add("dragging");
  });

  element.addEventListener("dragover", function (event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  });
  
  element.closest(".single-task-container").addEventListener("dragenter", function (event) {
    event.preventDefault();
    const container = event.target.closest(".single-task-container");
    container.style.border = "1px solid yellow";
  });

  element.addEventListener("dragleave", function (event) {
    event.preventDefault();
    const container = event.target.closest(".single-task-container");
    container.style.border = "1px solid var(--primary-bg-black50)";
  });

  element.addEventListener("dragend", function (event) {
    event.preventDefault();
    const container = event.target.closest(".single-task-container");
    container.classList.add("drop-target");
    container.classList.remove("dragging");
  });

  element.addEventListener("drop", function (event) {
    event.preventDefault();

    const draggedElementId = event.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(draggedElementId);
  });
}
