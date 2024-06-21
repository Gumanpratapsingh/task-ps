import { useState } from "react";

export const Modal = ({ isOpen, onClose, onSubmit, initialData, mode }) => {
    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [dueDate, setDueDate] = useState(initialData?.dueDate || "");

    const resetForm = () => {
        setTitle(initialData?.title || "");
        setDescription(initialData?.description || "");
        setDueDate(initialData?.dueDate || "");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = () => {
        onSubmit(title, description, dueDate);
        resetForm();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded z-50 w-96">
                <h2 className="text-lg font-bold mb-4">{mode === 'update' ? 'Update Task' : 'Add New Task'}</h2>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2 w-full mb-3"
                    aria-label="Task Title"
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border p-2 w-full mb-3"
                    aria-label="Task Description"
                />
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="border p-2 w-full mb-4"
                    aria-label="Due Date"
                />
                <div className="flex justify-end space-x-2">
                    <button onClick={handleClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                    <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">{mode === 'update' ? 'Update' : 'Submit'}</button>
                </div>
            </div>
        </div>
    );
};