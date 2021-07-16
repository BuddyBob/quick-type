import React, { useRef, useState } from 'react'
import NavBar from '../Nav/NavBar'
import { Alert } from "react-bootstrap"
import { useAuth } from '../context/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import './Register.css'
const ForgotPassword = () =>  {
        const emailRef = useRef()
        const { login } = useAuth()   
        const [error, setError] = useState('')
        const [loading, setLoading] = useState("false")
        const history = useHistory()
        async function handleSubmit(e) {
            e.preventDefault()
        
            try {
              setError("")
              setLoading("true")
              await login(emailRef.current.value, passwordRef.current.value)
              history.push('/')
            } catch(err) {
                if (err.message === "The password is invalid or the user does not have a password."){
                    setError("Email or password is incorrect!")
                }else{setError(err.message)}
            }
        
            setLoading("false")
        }
        
        return (
            <div>
                <NavBar/>
                <div className="wrapper fadeInDown">
                    <div id="formContent">
                        <div className="fadeIn first">
                        <h2 className="register-title">Quick Type - Login</h2>
                        </div>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <form onSubmit={handleSubmit}>
                            <input autoComplete="off" ref={emailRef} type="text" id="email" className="fadeIn second" name="login" placeholder="Email" required/>
                            <input disable={loading} type="submit" className="fadeIn fourth" value="Reset Password"/>
                        </form>
                        <div className="redirect-register">
                            <span className="redirect-register-text">Don't have an account? <Link to="/signup" style={{ textDecoration: 'none' }}><h5 className="redirect-register-click">Sign Up!</h5></Link></span>
                        </div>
                    </div>
                </div>
            </div>
        )
}
export default Login
