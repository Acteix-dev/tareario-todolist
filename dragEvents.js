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
      const parent = dropTarget.parentNode;

      // Get current positions before moving
      const draggedRect = draggedElement.getBoundingClientRect();
      const targetRect = dropTarget.getBoundingClientRect();

      // Calculate movement distances
      const deltaY = targetRect.top - draggedRect.top;

      // Apply transition for smooth movement
      draggedElement.style.transition = "transform 0.3s ease";
      dropTarget.style.transition = "transform 0.3s ease";

      // Move elements visually
      draggedElement.style.transform = `translateY(${deltaY}px)`;
      dropTarget.style.transform = `translateY(${-deltaY}px)`;

      // Wait for animation to finish before swapping in DOM
      setTimeout(() => {
        draggedElement.style.transition = "";
        dropTarget.style.transition = "";
        draggedElement.style.transform = "";
        dropTarget.style.transform = "";

        // Swap elements in the DOM
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
