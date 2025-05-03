<h2 className="text-4xl text-green-500 font-bold">Task Manager</h2>


import React, { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api/taskApi';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: "", status: "pending", priority: "medium" });

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getTasks();
                setTasks(data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        fetchTasks();
    }, []);

    const handleCreateTask = async (event) => {
        event.preventDefault();
        if (!newTask.title.trim()) return;
        try {
            const createdTask = await createTask(newTask);
            setTasks([...tasks, createdTask]);
            setNewTask({ title: "", status: "pending", priority: "medium" });
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Task Manager</h2>

            {/* Task Creation Form */}
            <form onSubmit={handleCreateTask} className="mb-6 flex flex-col gap-3">
                <input 
                    type="text" 
                    placeholder="Enter task title..." 
                    value={newTask.title} 
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="p-3 border border-gray-600 rounded-lg w-full bg-gray-700 text-white focus:ring-2 focus:ring-blue-400"
                />
                <select 
                    value={newTask.priority} 
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="p-3 border border-gray-600 rounded-lg w-full bg-gray-700 text-white"
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all">
                    Add Task
                </button>
            </form>

            <button 
                onClick={() => handleCreateTask()} 
                className="bg-gray-800 text-white px-4 py-2 mb-4 rounded-lg hover:bg-gray-600 transition-all"
            >
                Reset Sample Tasks
            </button>

            <ul className="space-y-3">
                {tasks.length === 0 ? (
                    <p className="text-gray-400 text-center">No tasks available</p>
                ) : (
                    tasks.map(task => (
                        <li key={task._id} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg shadow-md">
                            <span className="text-lg">{task.title} - {task.status} ({task.priority})</span>
                            <div className="space-x-2">
                                <button 
                                    onClick={() => updateTask(task._id, { status: "completed" })} 
                                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-all"
                                >
                                    Update
                                </button>
                                <button 
                                    onClick={() => deleteTask(task._id)} 
                                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div> 
    );
};

export default TaskList;