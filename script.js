const API_URL = "http://localhost:8080/api/tasks";

// Check if user is logged in
const token = localStorage.getItem("token");
const username = localStorage.getItem("username");

if (!token) {
    window.location.href = "login.html";
}

// Add username to page
document.addEventListener("DOMContentLoaded", function() {
    const h1 = document.querySelector("h1");
    if (h1 && username) {
        h1.innerText = `Study Planner - ${username} 👋`;
    }
    loadTasks();
});

// Logout function
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "login.html";
}

// Get headers with JWT token
function getHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
    };
}

// Load all tasks from backend
function loadTasks() {
    fetch(API_URL, { headers: getHeaders() })
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.getElementById("taskList");
            taskList.innerHTML = "";

            if (tasks.length === 0) {
                taskList.innerHTML = '<div class="empty-state">📭 No tasks yet! Add your first task above.</div>';
            }

            let pending = 0;
            let completed = 0;

            tasks.forEach(task => {
                if (task.status === "completed") completed++;
                else pending++;

                const li = document.createElement("li");
                li.className = "task-item";
                li.innerHTML = `
                    <div>
                        <div class="task-subject">📚 ${task.subject}</div>
                        <div class="task-details">${task.title} • ${task.description} hrs • ${task.status}</div>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button class="btn-primary" style="padding:6px 12px; font-size:12px;"
                            onclick="completeTask(${task.id}, '${task.status}')">
                            ${task.status === "completed" ? "↩ Undo" : "✅ Done"}
                        </button>
                        <button class="btn-danger" onclick="deleteTask(${task.id})">🗑</button>
                    </div>
                `;
                taskList.appendChild(li);
            });

            document.getElementById("totalTasks").innerText = tasks.length;
            document.getElementById("pendingTasks").innerText = pending;
            document.getElementById("completedTasks").innerText = completed;
        })
        .catch(err => console.error("Error loading tasks:", err));
}

function completeTask(id, currentStatus) {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ status: newStatus })
    })
    .then(() => loadTasks())
    .catch(err => console.error("Error updating task:", err));
}

// Add a new task
function addTask() {
    const subject = document.getElementById("subject").value;
    const day = document.getElementById("day").value;
    const hours = document.getElementById("hours").value;

    if (!subject || !hours) {
        alert("Please fill in subject and hours!");
        return;
    }

    const task = {
        title: day,
        subject: subject,
        description: hours,
        status: "pending"
    };

    fetch(API_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(task)
    })
    .then(response => response.json())
    .then(() => {
        loadTasks();
        document.getElementById("subject").value = "";
        document.getElementById("hours").value = "";
    })
    .catch(err => console.error("Error adding task:", err));
}

// Delete a task
function deleteTask(id) {
    fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getHeaders()
    })
    .then(() => loadTasks())
    .catch(err => console.error("Error deleting task:", err));
}

// ⏱ Pomodoro Timer
let timer;
let timeLeft = 25 * 60;
let running = false;

function startTimer() {
    if (running) {
        clearInterval(timer);
        running = false;
        document.querySelector("button[onclick='startTimer()']").innerText = "Start Pomodoro";
        return;
    }

    running = true;
    document.querySelector("button[onclick='startTimer()']").innerText = "Pause";

    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            running = false;
            alert("⏰ Pomodoro session complete! Take a break.");
            timeLeft = 25 * 60;
            document.getElementById("timer").innerText = "25:00";
            document.querySelector("button[onclick='startTimer()']").innerText = "Start Pomodoro";
            return;
        }
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById("timer").innerText =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }, 1000);
}
function setMode(minutes, btn) {
    clearInterval(timer);
    running = false;
    timeLeft = minutes * 60;
    document.getElementById("timer").innerText =
        `${String(minutes).padStart(2, "0")}:00`;
    document.getElementById("timerBtn").innerText = "▶ Start";
    document.querySelectorAll(".timer-mode-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
}

function resetTimer() {
    clearInterval(timer);
    running = false;
    timeLeft = 25 * 60;
    document.getElementById("timer").innerText = "25:00";
    document.getElementById("timerBtn").innerText = "▶ Start";
}