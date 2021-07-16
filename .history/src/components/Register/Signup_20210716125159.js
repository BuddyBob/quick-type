import React, { useRef, useState } from 'react'
import NavBar from '../Nav/NavBar'
import { Alert } from "react-bootstrap"
import { useAuth } from '../context/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import { db } from '../../firebase'
import './Register.css'
import Reload from '../Reload'
const Signup = (props) =>  {
        const emailRef = useRef()
        const passwordRef = useRef()
        const passwordConfirmRef = useRef()
        const { signup } = useAuth()   
        const [error, setError] = useState('')
        const [loading, setLoading] = useState("false")
        const history = useHistory()
        const { currentUser, logout } = useAuth()
        async function handleSubmit(e) {
            e.preventDefault()
            if (passwordRef.current.value !== passwordConfirmRef.current.value) {
              return setError("Passwords do not match")
            }
            if (passwordRef.current.value === passwordConfirmRef.current.value){
                try {
                    setError("")
                    setLoading("true")
                    await signup(emailRef.current.value, passwordRef.current.value)
                    //add new data to user
                    console.log(currentUser)
                    db.collection("users").doc(currentUser.uid).add({
                        email: emailRef.current.value,
                        password: passwordRef.current.value,
                        wordCount:"15",
                        englishType:"english",
                    })
                    .then((docRef) => {
                        localStorage.setItem("currentUserId",currentUser.uid)
                        console.log("Document written with ID: ", currentUser.uid);
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });        
                    console.log("ADDED USER")       
                    history.push('/')
                } catch(err) {
                    console.log("ERROR",err)
                    setError(err.message)
                }
                setLoading("false")
            }
        }
        
        return (
            <div>
                <NavBar/>
                <div className="wrapper fadeInDown">
                    <div id="formContent">

                        <div className="fadeIn first">
                        <h2 className="register-title">Quick Type - Sign up</h2>
                        </div>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <form onSubmit={handleSubmit}>
                            <input autoComplete="off" ref={emailRef} type="text" id="email" className="fadeIn second" name="login" placeholder="Email" required/>
                            <input autoComplete="off" ref={passwordRef} type="password" id="password" className="fadeIn third" name="login" placeholder="Password" required/>
                            <input autoComplete="off" ref={passwordConfirmRef} type="password" id="confirm-password" className="fadeIn third" name="login" placeholder="Confirm Password" required/>
                            <input disable={loading} type="submit" className="fadeIn fourth" value="Sign Up"/>
                        </form>
                    <div className="redirect-register">
                        <span className="redirect-register-text">Already have an account? <Link to="/login" style={{ textDecoration: 'none' }}><h5 className="redirect-register-click">Login!</h5></Link></span>
                    </div>
                    </div>
                </div>
            </div>
        )
}
export default Signup
