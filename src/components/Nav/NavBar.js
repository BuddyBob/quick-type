import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineMenu } from 'react-icons/ai'
import './NavBar.css'
import { useAuth } from '../context/AuthContext'
function NavBar() {
    const { currentUser, logout } = useAuth()
    return (
        <div id="navbar">
            {currentUser &&
            <div id="logged-in">
                <nav className="navbar">
                    <Link to="/" style={{textDecoration: 'none' }}>
                        <span className="logo">Quick Type</span>
                    </Link>
                    <div className="navbar-links">
                        <ul>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="/settings">Settings</Link>
                            </li>
                            <li>
                                <Link to="/stats">Stats</Link>
                            </li>
                            <li>
                                <Link to="/info">Info</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
            }
            {currentUser === null &&
            <div id="logged-out">
                <nav className="navbar">
                    <Link to="/" style={{textDecoration: 'none' }}>
                        <span className="logo">Quick Type</span>
                    </Link>
                    <div className="navbar-links">
                        <ul>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="/info">Info</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
            }
        </div>
    )
}

export default NavBar
