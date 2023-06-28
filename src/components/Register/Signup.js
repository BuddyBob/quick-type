import './Register.css';

import { Alert, AlertTitle } from '@material-ui/lab';
import { Link, useHistory } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import { collection, db, doc, getDocs, setDoc } from '../../firebase';

import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import NavBar from '../Nav/NavBar';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth } from '../context/AuthContext';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(),
    },
  },
  errorText: {
    textAlign: 'left',
  },
}));

const encryptPwd = (pwd) => {
  const CryptoJS = require('crypto-js');
  const passphrase = 'sank bridged imitation dose';
  return CryptoJS.AES.encrypt(pwd, passphrase).toString();
};

const Signup = () => {
  const classes = useStyles();
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { currentUser } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    let users = await returnedUsernames();
    if (users.includes(usernameRef.current.value)) {
      console.log('Username already exists');
      return setError('This username is taken');
    }

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      const userCredential = await signup(
        emailRef.current.value,
        passwordRef.current.value
      );

      // Add new data to user
      let encryptedPwd = encryptPwd(passwordRef.current.value);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: emailRef.current.value,
        password: encryptedPwd,
        username: usernameRef.current.value,
        wordCount: '10',
        englishType: 'english1k',
        audio: false,
        logs: {
          errorHistory: [],
          wpmHistory: [],
          rawWpmHistory: [],
          accuracyHistory: [],
          realAccuracyHistory: [],
        },
      });

      localStorage.setItem('currentUserId', userCredential.user.uid);
      console.log('ADDED USER', userCredential.user.uid);
      history.push('/');
    } catch (err) {
      console.log('ERROR', err);
      setError(err.message);
    }

    setLoading(false);
  }

  async function returnedUsernames() {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const usernames = querySnapshot.docs.map((doc) => doc.data().username);
    return usernames;
  }

  return (
    <div>
      <NavBar />
      <div className="wrapper fadeInDown">
        <div id="formContent">
          <div className="fadeIn first">
            <h2 className="register-title">Quick Type - Sign up</h2>
          </div>
          {error && (
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
                severity="error"
              >
                <AlertTitle>Oh No!</AlertTitle>
                {error}
              </Alert>
            </div>
          )}
          <form autoComplete="off" onSubmit={handleSubmit}>
            <input type="text" name="username" style={{ display: 'none' }} value="fake input" />
            <input autoComplete="off" ref={usernameRef} type="text" id="username" className="fadeIn third" placeholder="username" required />
            <input autoComplete="off" ref={emailRef} type="text" id="email" className="fadeIn second" placeholder="email" required />
            <input autoComplete="off" ref={passwordRef} type="password" id="password" className="fadeIn fourth" placeholder="Password" required />
            <input autoComplete="off" ref={passwordConfirmRef} type="password" id="confirm-password" className="fadeIn fifth" name="login" placeholder="Confirm Password" required />
            <input disable={loading} type="submit" className="fadeIn fourth" value="Sign Up" />
          </form>
          <div className="redirect-register">
            <span className="redirect-register-text">Already have an account? <Link to="/login" style={{ textDecoration: 'none' }}><h5 className="redirect-register-click">Login!</h5></Link></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
