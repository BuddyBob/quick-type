import React, { useRef, useState } from 'react'
import { Alert } from "react-bootstrap"
import { useAuth } from '../context/AuthContext'
import './Signup.css'
const Login = (props) =>  {
        const emailRef = useRef()
        const passwordRef = useRef()
        const passwordConfirmRef = useRef()
        const { signup } = useAuth()   
        const [error, setError] = useState('')
        const [loading, setLoading] = useState("false")
        async function handleSubmit(e) {
            e.preventDefault()
        
            if (passwordRef.current.value !== passwordConfirmRef.current.value) {
              return setError("Passwords do not match")
            }
        
            try {
              setError("")
              setLoading("true")
              await signup(emailRef.current.value, passwordRef.current.value)
            } catch(err) {
                console.log("ERROR",err)
                setError(err.message)
            }
        
            setLoading("false")
        }
        
        return (
            <div className="wrapper fadeInDown">
                <div id="formContent">

                    <div className="fadeIn first">
                    <h1>Quick Type</h1>
                    </div>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <input autoComplete="off" ref={emailRef} type="text" id="email" className="fadeIn second" name="login" placeholder="Email" required/>
                        <input autoComplete="off" ref={passwordRef} type="text" id="password" className="fadeIn third" name="login" placeholder="Password" required/>
                        <input autoComplete="off" ref={passwordConfirmRef} type="text" id="confirm-password" className="fadeIn third" name="login" placeholder="Confirm Password" required/>
                        <input disable={loading} type="submit" className="fadeIn fourth" value="Log In"/>
                    </form>
                {/* <div className="m-0 login-button-atSignup">
                    Already have an account? Log In
                </div> */}
                </div>
            </div>
        )
}
export default Signup
