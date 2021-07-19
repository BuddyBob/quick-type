import React, { useRef, useState, useEffect  } from 'react'
import NavBar from '../Nav/NavBar'
import { Alert } from "react-bootstrap"
import { useAuth } from '../context/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import { db } from '../../firebase'
import './Register.css'
const Login = (props) =>  {
        const emailRef = useRef()
        const passwordRef = useRef()
        const { currentUser, login } = useAuth()   
        const [error, setError] = useState('')
        const [loading, setLoading] = useState("false")
        const history = useHistory()
        function returnUserData(userId){
            let docRef = db.collection("users").doc(userId)
            return docRef.get().then((doc) => {
              if (doc.exists) {
                  console.log("DATA"+doc.data())
                  return doc.data();
              } else {
                  // doc.data() will be undefined in this case
                  console.log("No such document!");
              }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
          }
        async function handleSubmit(e) {
            e.preventDefault()
        
            try {
              setError("")
              setLoading("true")
              const x = await login(emailRef.current.value, passwordRef.current.value)
              console.log("LOGGED IN TO USER", x.user.uid)
              localStorage.setItem("currentUserId",x.user.uid)
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
                            <input autoComplete="off" ref={passwordRef} type="password" id="password" className="fadeIn third" name="login" placeholder="Password" required/>
                            <input disable={loading} type="submit" className="fadeIn fourth" value="Log In"/>
                        </form>
                        <div className="redirect-register">
                            <span className="redirect-register-text">Don't have an account? <Link to="/signup" style={{ textDecoration: 'none' }}><h5 className="redirect-register-click">Sign Up!</h5></Link></span>
                        </div>
                    </div>
                    <div className="pt-2 forgot-pwd">
                        <Link to="/forgot-password"> <span style={{color:"white",fontSize:"13px",textDecoration:"1px underline #ffdc7a"}}>Forgot password?</span></Link>
                    </div>
                </div>
            </div>
        )
}
export default Login
