window.addEventListener("DOMContentLoaded", renderBoard);

let currentDraggedTask = null;

function renderBoard() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  clearBoard();
  tasks.forEach(task => {
    const column = document.getElementById(task.status);
    if (column) {
      const taskCard = document.createElement("div");
      taskCard.classList.add("task-card");
      taskCard.innerHTML = getTaskCardHTML(task);
      column.appendChild(taskCard);
    }
  });
}

function clearBoard() {
  document.getElementById("toDo").innerHTML = "";
  document.getElementById("inProgress").innerHTML = "";
  document.getElementById("done").innerHTML = "";
}

function startDragging(title) {
  currentDraggedTask = title;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTask(newStatus) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskIndex = tasks.findIndex(t => t.title === currentDraggedTask);
  if (taskIndex > -1) {
    tasks[taskIndex].status = newStatus;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderBoard();
  }
  currentDraggedTask = null;
}

function showTaskDetails(title) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const task = tasks.find(t => t.title === title);
  if (task) {
    let subtasksHTML = task.subtasks.map((s, index) => {
      return `
        <label>
          <input type="checkbox" onchange="toggleSubtask('${task.title}', ${index})" ${s.completed ? "checked" : ""}>
          ${s.name}
        </label>
      `;
    }).join("");
    const html = `
      <h2 contenteditable="true" id="editTitle">${task.title}</h2>
      <p contenteditable="true" id="editDescription">${task.description}</p>
      <p><strong>Deadline:</strong> <input type="date" id="editDeadline" value="${task.deadline}"></p>
      <p><strong>Priority:</strong> 
        <select id="editPriority">
          <option value="urgent" ${task.priority === "urgent" ? "selected" : ""}>Urgent</option>
          <option value="medium" ${task.priority === "medium" ? "selected" : ""}>Medium</option>
          <option value="low" ${task.priority === "low" ? "selected" : ""}>Low</option>
        </select>
      </p>
      <p><strong>Assigned:</strong> <input type="text" id="editAssigned" value="${task.assignedTo}"></p>
      <p><strong>Subtasks:</strong><br> ${subtasksHTML}</p>
      <button onclick="saveTask('${title}')" class="btn-primary">💾 Save</button>
      <button onclick="deleteTask('${title}')" class="btn-secondary">🗑️ Delete</button>
    `;
    document.getElementById("overlayContent").innerHTML = html;
    document.getElementById("taskOverlay").classList.remove("hidden");
  }
}

function closeOverlay() {
  document.getElementById("taskOverlay").classList.add("hidden");
}

function saveTask(originalTitle) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const index = tasks.findIndex(t => t.title === originalTitle);
  if (index > -1) {
    tasks[index].title = document.getElementById("editTitle").innerText.trim();
    tasks[index].description = document.getElementById("editDescription").innerText.trim();
    tasks[index].deadline = document.getElementById("editDeadline").value;
    tasks[index].priority = document.getElementById("editPriority").value;
    tasks[index].assignedTo = document.getElementById("editAssigned").value;
    tasks[index].subtasks = document.getElementById("editSubtasks") 
      ? document.getElementById("editSubtasks").value.split(",").map(s => ({ name: s.trim(), completed: false }))
      : tasks[index].subtasks;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    closeOverlay();
    renderBoard();
  }
}

function deleteTask(title) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(t => t.title !== title);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  closeOverlay();
  renderBoard();
}

function toggleSubtask(taskTitle, subtaskIndex) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const task = tasks.find(t => t.title === taskTitle);
  if (task && task.subtasks[subtaskIndex]) {
    task.subtasks[subtaskIndex].completed = !task.subtasks[subtaskIndex].completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}
