function getTaskCardHTML(task) {
  return `
    <div 
      class="draggable-task" 
      draggable="true" 
      ondragstart="startDragging('${task.title}')" 
      onclick="showTaskDetails('${task.title}')"
    >
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <p><strong>Deadline:</strong> ${task.deadline}</p>
      <p><strong>Priority:</strong> ${task.priority}</p>
    </div>
  `;
}
