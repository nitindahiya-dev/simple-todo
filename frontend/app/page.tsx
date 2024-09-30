"use client";
import { useState, useEffect } from 'react';

// Define the task type (this should match what your backend returns)
interface Task {
  id: number; // Each task has a unique ID
  task: string; // The task description
}

export default function Home() {
  // Explicitly type the tasks array to hold Task objects
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");

  const handleAddTask = async () => {
    if (!newTask.trim()) {
      console.error('Task cannot be empty');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8080/tasks', {
        method: 'POST',
        body: JSON.stringify({ task: newTask }), // Ensure we're only sending the 'task' field
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const addedTask: Task = await response.json(); // Get the new task from the response
        setTasks([...tasks, addedTask]); // Add the new task to the existing tasks
        setNewTask(""); // Clear input after adding
      } else {
        const errorText = await response.text();
        console.error('Error adding task:', errorText); // Log the error message from the server
      }
    } catch (error) {
      console.error('Error during task submission:', error);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8080/tasks');
        if (res.ok) {
          const data: Task[] = await res.json();
          setTasks(data);
          console.log('Fetched tasks:', data); // Log fetched tasks
        } else {
          console.error('Failed to fetch tasks:', res.statusText); // Log error if fetching fails
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <h1>To-Do List</h1>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add new task"
      />
      <button onClick={handleAddTask}>Add Task</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.task}</li> // Ensure each task is uniquely identified by its ID
        ))}
      </ul>
    </div>
  );
}
