import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPenNib } from '@fortawesome/free-solid-svg-icons';
import { Modal } from './Modal'; // Add this import statement

const formatDate = (dueDate) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0); // Ignore time part

    if (due.getTime() === today.getTime()) {
        return 'Today';
    } else if (due.getTime() === tomorrow.getTime()) {
        return 'Tomorrow';
    } else {
        // Format the date as DD-MM-YYYY
        return due.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
};

const Card = ({ task, fetchTasks }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    const handleDelete = async (taskId) => {
        try {
            await axios.delete(`https://evening-ridge-00209-ff80fa958fb2.herokuapp.com/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('Task deleted successfully');
            fetchTasks();  // Refresh the task list
        } catch (error) {
            console.error('Failed to delete task:', error);
            alert('Failed to delete task');
        }
    };

    const handleUpdate = () => {
        setIsUpdateModalOpen(true);
    };

    const updateTask = async (title, description, dueDate) => {
        try {
            await axios.patch(`https://evening-ridge-00209-ff80fa958fb2.herokuapp.com/tasks/${task._id}`, {
                title,
                description,
                dueDate
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchTasks();
            setIsUpdateModalOpen(false);
        } catch (error) {
            console.error('Failed to update task:', error);
            alert('Failed to update task');
        }
    };

    return (
        <div style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px auto', // Center card horizontally
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            transition: '0.3s',
            width: '80%', // Adjust width as needed
            maxWidth: '600px', // Maximum width
            display: 'block', // Use block layout
            position: 'relative'
        }} onClick={toggleDetails}>
            <h3 style={{ fontWeight: 'bold' }}>{task.title}</h3>
            {showDetails && (
                <div>
                    <p>Description: {task.description}</p>
                    <p>Due Date: {formatDate(task.dueDate)}</p>
                    <FontAwesomeIcon icon={faTimes} onClick={(e) => {
                        e.stopPropagation(); // Prevent the card toggle function from firing
                        handleDelete(task._id);
                    }} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', color: 'red' }} />
                    <FontAwesomeIcon icon={faPenNib} onClick={(e) => {
                        e.stopPropagation(); // Prevent the card toggle function from firing
                        handleUpdate();
                    }} style={{ position: 'absolute', bottom: '10px', right: '10px', cursor: 'pointer', color: 'green' }} />
                </div>
            )}
            <Modal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                onSubmit={updateTask}
                initialData={task}
                mode="update"
            />
        </div>
    );
};

export default Card;