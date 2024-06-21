import { InputBox } from '../components/InputBox'; // Add this line
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Modal } from '../components/Modal';
import Card from '../components/Card'; // Import the Card component

export const Task = () => {
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const currentUserId = localStorage.getItem('userId');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`https://evening-ridge-00209-ff80fa958fb2.herokuapp.com/tasks/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTasks(response.data);
    };

    const handleAddTask = async (title, description, dueDate) => {
        const today = new Date();
        const inputDate = new Date(dueDate);
        if (inputDate < today) {
            alert('Due date must be in the future.');
            return;
        }

        const userId = localStorage.getItem('userId'); // Ensure the user ID is retrieved correctly
        try {
            const response = await axios.post('https://evening-ridge-00209-ff80fa958fb2.herokuapp.com/tasks', {
                title, 
                description, 
                dueDate, 
                userId
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // Ensure the token is sent for authorization
            });
            fetchTasks(); // Refresh the list of tasks after adding a new one
            setIsModalOpen(false); // Close the modal after task submission
        } catch (error) {
            console.error('Error adding task:', error);
            alert('Failed to add task'); // Optionally handle errors more gracefully
        }
    };

    return (
        <div>
            <Navbar />
            <button onClick={() => setIsModalOpen(true)} className="fixed bottom-4 left-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                <FontAwesomeIcon icon={faPlus} />
            </button>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddTask}
            >
                <InputBox onChange={(e) => {
                    setDueDate(e.target.value);
                }} placeholder="YYYY-MM-DD" label={"Due Date"} type="date" />
            </Modal>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {tasks.map(task => (
                    <Card key={task._id} task={task} fetchTasks={fetchTasks} />
                ))}
            </ul>
        </div>
    );
};