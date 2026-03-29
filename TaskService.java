package com.example.studyplanner.service;

import com.example.studyplanner.model.Task;
import com.example.studyplanner.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    // Get all tasks
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // Get task by ID
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    // Add new task
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    // Update task
    public Task updateTask(Long id, Task updatedTask) {
        updatedTask.setId(id);
        return taskRepository.save(updatedTask);
    }

    // Delete task
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}