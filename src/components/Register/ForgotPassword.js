import './Register.css'

import { Alert, AlertTitle } from '@mui/material';
import React, { useRef, useState } from 'react'

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom'
import NavBar from '../Nav/NavBar'
import { makeStyles } from '@mui/styles';
import { useAuth } from '../context/AuthContext'

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      '& > * + *': {
      },
    },
    errorText: {
        textAlign: 'left'
    },
    successText: {
        textAlign: 'left'
    }
}));
const ForgotPassword = () =>  {
        const classes = useStyles();
        const emailRef = useRef()
        const { resetPassword } = useAuth()
        const [error, setError] = useState('')
        const [loading, setLoading] = useState("false")
        const [message, setMessage] = useState('')
        async function handleSubmit(e) {
            e.preventDefault()
        
            try {
              setMessage('')
              setError("")
              setLoading("true")
              await resetPassword(emailRef.current.value)
              setMessage("Check you inbox for further instructions")
            } catch(err) {
                setError(err.message)
            }
            setLoading("false")
        }
        
        return (
            <div>
                <NavBar/>
                <div className="wrapper fadeInDown">
                    <div id="formContent">
                        <div className="fadeIn first">
                        <h2 className="register-title">Password Reset</h2>
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
                                        <CloseIcon fontSize="inherit" />
                                        </IconButton>
                                    }
                                className={classes.errorText} 
                                severity="error">
                                    <AlertTitle>Oh No!</AlertTitle>
                                    {error}
                                </Alert>
                            </div>
                        }
                        {message && 
                            <div className={classes.root}>
                                <Alert 
                                    icon={<CheckIcon fontSize="inherit" />}
                                    className={classes.successText} 
                                    severity="success">
                                    <AlertTitle>Success!</AlertTitle>
                                    {message}
                                </Alert>
                            </div>
                        }
                        <form onSubmit={handleSubmit}>
                            <input autoComplete="off" ref={emailRef} type="text" id="email" className="fadeIn second" name="login" placeholder="Email" required/>
                            <input disable={loading} type="submit" className="fadeIn fourth" value="Reset Password"/>
                        </form>
                        <div className="redirect-register">
                            <Link to="/login" style={{ textDecoration: 'none' }}><span style={{textDecoration:"underline #ffdc7a"}} className="m-3 redirect-register-text">Login</span></Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
export default ForgotPassword
