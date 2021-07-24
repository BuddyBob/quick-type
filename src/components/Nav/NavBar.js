import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineMenu } from 'react-icons/ai'
import './NavBar.css'
import { useAuth } from '../context/AuthContext'
function NavBar() {
    const { currentUser, logout } = useAuth()
    const [loggedIn,setLoggedIn] = useState(currentUser ? true : false)
    console.log(loggedIn)
    const [open,setOpen] = useState(false)
    return (
        <div>
            {loggedIn &&
            <div>
                <nav>
                    <Link className="logo" to="/">Quick Type</Link>
                    <ul className={"nav-links-wide"} style={{transform:open ? "translateX(-125px)" : ""}}>
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
                    <span onClick={() => setOpen(!open)} className="burger"><AiOutlineMenu/></span>
                </nav>
            </div>
            }
            {!loggedIn && 
            <div>
                <nav>
                    <Link className="logo" to="/">Quick Type</Link>
                    <ul className={"nav-links-skinny"} style={{transform:open ? "translateX(0px)" : ""}}>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/info">Info</Link>
                        </li>
                    </ul>
                    <span onClick={() => setOpen(!open)} className="burger"><AiOutlineMenu/></span>
                </nav>
            </div>
            }
        </div>
    )
}

export default NavBar
