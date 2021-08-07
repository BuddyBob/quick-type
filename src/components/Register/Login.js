import React, { useRef, useState  } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AlertTitle, Alert } from '@material-ui/lab';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
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
function modErrors(error){
    console.log(error)
    switch (true){
        case error === 'There is no user record corresponding to this identifier. The user may have been deleted.':
            error = "We could not find this user."
        case error === "The password is invalid or the user does not have a password.":
            error = "We could not find this user."
    }
    return error;

}
const Login = () =>  {
        const classes = useStyles();
        const emailRef = useRef()
        const passwordRef = useRef()
        const { login } = useAuth()   
        const [error, setError] = useState('')
        const [loading, setLoading] = useState("false")
        const history = useHistory()
        async function handleSubmit(e) {
            e.preventDefault()
            try {
              setError('')
              setLoading("true")
              const x = await login(emailRef.current.value, passwordRef.current.value)
              console.log("LOGGED IN TO USER", x.user.uid)
              localStorage.setItem("currentUserId",x.user.uid)
              history.push('/')
            } catch(err) {
                setError(modErrors(err.message))
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
