import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineMenu } from 'react-icons/ai'
import './NavBar.css'
function NavBar() {
    const [open,setOpen] = useState(false)
    return (
        <div>
            <nav>
                <Link className="logo" to="/">Quick Type</Link>
                <ul className="nav-links" style={{transform:open ? "translateX(0px)" : ""}}>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/settings">Settings</Link>
                    </li>
                    <li>
                        <Link to="/info">Info</Link>
                    </li>
                </ul>
                <span onClick={() => setOpen(!open)} className="burger"><AiOutlineMenu/></span>
            </nav>
        </div>
    )
}

export default NavBar
