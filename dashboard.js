// Get tasks from localStorage
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Calculate hours per day
const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
let hoursData = [0,0,0,0,0,0,0];

tasks.forEach(task => {
    const index = days.indexOf(task.day);
    if (index !== -1) {
        hoursData[index] += Number(task.hours);
    }
});

// Create Chart
const ctx = document.getElementById("chart");

new Chart(ctx, {
    type: "bar",
    data: {
        labels: days,
        datasets: [{
            label: "Study Hours",
            data: hoursData
        }]
    }
});
const API_URL = "http://localhost:8080/api/tasks";

// Load tasks when page opens
window.onload = function() {
    loadTasks();
};

// Fetch all tasks from backend and display them
function loadTasks() {
    fetch(API_URL)
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.getElementById("taskList");
            taskList.innerHTML = "";
            tasks.forEach(task => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <span>📚 <strong>${task.subject}</strong> — ${task.title} 
                    (${task.description} hrs) — ${task.status}</span>
                    <button onclick="deleteTask(${task.id})">❌</button>
                `;
                taskList.appendChild(li);
            });
        })
        .catch(err => console.error("Error loading tasks:", err));
}

// Add a new task to backend
function addTask() {
    const subject = document.getElementById("subject").value;
    const day = document.getElementById("day").value;
    const hours = document.getElementById("hours").value;

    if (!subject || !hours) {
        alert("Please fill in subject and hours!");
        return;
    }

    const task = {
        title: day,           // day stored as title
        subject: subject,
        description: hours,   // hours stored as description
        status: "pending"
    };

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task)
    })
    .then(response => response.json())
    .then(() => {
        loadTasks(); // refresh list
        document.getElementById("subject").value = "";
        document.getElementById("hours").value = "";
    })
    .catch(err => console.error("Error adding task:", err));
}

// Delete a task
function deleteTask(id) {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
        .then(() => loadTasks())
        .catch(err => console.error("Error deleting task:", err));
}