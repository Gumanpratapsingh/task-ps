import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons'; // Import the regular user icon

export const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const userEmail = localStorage.getItem('email'); // Retrieve user email from local storage
    console.log("Retrieved email:", userEmail); // Added for debugging
    let timeoutId = null;

    const handleMouseEnter = () => {
        if (timeoutId) clearTimeout(timeoutId); // Clear any existing timeout to prevent premature hiding
        setShowDropdown(true);
    };

    const handleMouseLeave = () => {
        timeoutId = setTimeout(() => {
            setShowDropdown(false);
        }, 10000); // Set to hide after 10 seconds
    };

    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between">
            <ul className="flex space-x-4">
                <li><Link to="/tasks">Tasks</Link></li>
            </ul>
            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <Link to="/profile">
                    <FontAwesomeIcon icon={faUser} style={{ height: '24px', color: 'white' }} />
                </Link>
                {showDropdown && (
                    <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl">
                        <div className="block px-4 py-2 text-sm text-gray-500 hover:bg-gray-100">{userEmail}</div>
                        <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => {
                            localStorage.removeItem('token'); // Assuming token is stored in localStorage
                            localStorage.removeItem('email');
                            window.location.href = '/signin'; // Redirect to sign-in page
                        }}>Sign Out</div>
                    </div>
                )}
            </div>
        </nav>
    );
};
