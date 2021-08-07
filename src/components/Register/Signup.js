import React, { useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { AlertTitle, Alert } from '@material-ui/lab';
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { db } from '../../firebase'
import NavBar from '../Nav/NavBar'
import './Register.css'
const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(),
      },
    },
    errorText: {
        textAlign: 'left'
    }
}));
const Signup = () =>  {
        const classes = useStyles();
        const emailRef = useRef()
        const passwordRef = useRef()
        const passwordConfirmRef = useRef()
        const { signup } = useAuth()   
        const [error, setError] = useState('')
        const [loading, setLoading] = useState("false")
        const history = useHistory()
        const { currentUser } = useAuth()
        async function handleSubmit(e) {
            e.preventDefault()
            if (passwordRef.current.value !== passwordConfirmRef.current.value) {
              return setError("Passwords do not match")
            }
            if (passwordRef.current.value === passwordConfirmRef.current.value){
                try {
                    setError("")
                    setLoading("true")
                    console.log(currentUser)
                    const x = await signup(emailRef.current.value, passwordRef.current.value)
                    //add new data to user
                    db.collection("users").doc(x.user.uid).set({
                        email: emailRef.current.value,
                        password: passwordRef.current.value,
                        wordCount:"15",
                        englishType:"english1k",
                        logs:{
                            errorHistory:[],
                            wpmHistory:[],
                            rawWpmHistory:[],
                            accuracyHistory:[],
                            realAccuracyHistory:[]}
                    })
                    .then(() => {
                        localStorage.setItem("currentUserId",x.user.uid)
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });        
                    console.log("ADDED USER",x.user.uid)       
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
                        {error && 
                            <div className={classes.root}>
                                <Alert 
                                    action={
                                        <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            setError('');
                                        }}
                                        >
                                        <CloseIcon className={classes.closeIcon} fontSize="inherit" />
                                        </IconButton>
                                    }
                                className={classes.errorText} 
                                severity="error">
                                    <AlertTitle>Oh No!</AlertTitle>
                                    {error}
                                </Alert>
                            </div>
                        }
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