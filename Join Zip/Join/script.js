function login(event) {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (email === "admin@join.de" && password === "admin123") {
    localStorage.setItem("loggedIn", "true");
    window.location.href = "board.html";
  } else {
    alert("Login failed. Please check your credentials.");
  }
}

function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "index.html";
}

function checkLogin() {
  if (!localStorage.getItem("loggedIn")) {
    window.location.href = "index.html";
  }
}

function createTask(event) {
  event.preventDefault();

  const task = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    deadline: document.getElementById("deadline").value,
    category: document.getElementById("category").value,
    priority: document.querySelector("input[name='priority']:checked").value,
    assignedTo: document.getElementById("assignedTo").value,
    subtasks: document.getElementById("subtasks").value
      .split(",")
      .map(s => ({ name: s.trim(), completed: false })),
    status: "toDo"
  };

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  alert("Task created!");
  window.location.href = "board.html";
}
