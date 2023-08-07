import './index.css';
import './NavImages.css'

import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from "firebase/firestore";

import Accuracy from './components/Accuracy';
import { FaCrown } from 'react-icons/fa'
import { FaUserPlus } from 'react-icons/fa'
import GetText from './components/GetText';
import { IoLogIn } from 'react-icons/io5'
import { IoLogOut } from 'react-icons/io5'
import { IoSettingsSharp } from 'react-icons/io5'
import { IoStatsChart } from 'react-icons/io5'
import { Link } from 'react-router-dom';
import Popup from './components/Popup/Popup'
import Preview from './components/Preview';
import Reload from './components/Reload'
import SetData from './components/SetData'
import Wpm from './components/Wpm';
import assets from './assets'
import { db } from './firebase'
import { useAuth } from './components/context/AuthContext'

//dummy man
async function returnUserData(userId) {

  const docRef = doc(db, "users", userId);
  console.log(docRef)
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.log("Error getting document:", error);
  }
}
let interval = null
const soundList = [assets.sounds.click2,assets.sounds.click3,assets.sounds.click4,assets.sounds.click5,assets.sounds.click6,assets.sounds.click7]
function getRandom() {
  return soundList[Math.round(Math.random() * soundList.length)]
}
const Home = () =>  {
  // set hooks
  const { currentUser, logout } = useAuth()
  if (localStorage.getItem("englishType") == null){
    localStorage.setItem("englishType", "english1k")
  }


  const [userId, setUserId] = useState(currentUser ? currentUser.uid : null)
  const [loggedIn,setLoggedIn] = useState(currentUser ? true : false)
  const [text,setText] = useState(GetText(localStorage.getItem('wordCount'),localStorage.getItem('englishType')))
  localStorage.setItem('text',text) 
  
  const [englishType,setEnglishType] = useState(localStorage.getItem("englishType"))
  const [wordCount,setWordCount] = useState(localStorage.getItem("wordCount"))
  const [audioX,setAudioX] = useState(false)
  console.log(loggedIn)
  const updateText = async () => {
    if (loggedIn) {
      try {
        const result = await returnUserData(userId);
        console.log(result);
        setText(GetText(result.wordCount, result.englishType));
        setEnglishType(result.englishType);
        setWordCount(result.wordCount);
        localStorage.setItem("wordCount", result.wordCount);
        setAudioX(result.audio);
      } catch (error) {
        console.log("Error getting user data:", error);
      }
    } else {
      setText(GetText(localStorage.getItem('wordCount'), localStorage.getItem('englishType')));
      setEnglishType(localStorage.getItem('englishType'));
      setWordCount(localStorage.getItem('wordCount'));
      setAudioX(localStorage.getItem('audio'));
    }
  };
  
  useEffect(() => {
    console.log('hello')
    SetData();
    updateText();
  }, [loggedIn, userId]);

  const [popup, setPopup] = useState(false)
  const [userInput,setUserInput] = useState('')
  const [previousUserInput, setPreviousUserInput] = useState('') 
  const [symbols, setSymbols] = useState(0)
  const [errors,setError] = useState(0)
  const [finished, setFinished] = useState(false)
  const [sec,setSec] = useState(0)
  const [started,setStarted] = useState(false)
  //get new text
  function newText(event){
    event.preventDefault()
    Reload()
  }
    //logout
  async function handleLogout(){
      await logout()
      setEnglishType("english1k")
      setWordCount("15")
      localStorage.setItem("englishType","english1k")
      localStorage.setItem("wordCount","15")
      setLoggedIn(false)
      setUserId(null)
      console.log("LOGGED OUT")
      localStorage.removeItem("currentUserId");
      Reload() 
  }
  function playKeySound(){
      // get random sound
      let randSound = getRandom()
      //sometimes this may return `none`, so this is a backup
      while (!randSound){
        randSound = getRandom()
      }
      let audio = new Audio(randSound)
      audio.play()
  }
  //run function as input field changes
  function onUserInputChange(e){
    if (audioX){
      playKeySound()
    }
    const v = e.target.value;
    //check if error occurred
    if ((v.length>previousUserInput.length) && (v[v.length-1]!==text[v.length-1])){
      setError(errors + 1)
    }
    //function call set
    setPreviousUserInput(v)
    setTimer();
    onFinish()
    setUserInput(v)
    setSymbols(symbolCount(v).length)
  }
  function symbolCount(userInput){return userInput}

  //final wpm, includes errors as penalties
  function finalWpm(errors,sym,time){
    let GrossWpm = (sym/5) / (time/60);
    let ErrorRate = (errors*.5)/(time/60)
    let NetWpm = (GrossWpm-ErrorRate)
    if (NetWpm < 0){NetWpm = 0}
    return (Math.round(NetWpm))
  }
  //final raw wpm, does not include errors as penalties
  //meaning you can enter the whole given text incorrectly but at 50wpm, 
  //the raw wpm will be 50wpm
  function finalRawWpm(sym,time){
    let GrossWpm = (sym/5) / (time/60);
    if (GrossWpm < 0){GrossWpm = 0}
    return (Math.round(GrossWpm))
  }
  //gathers fake accuracy 
  //compares the final result to the given text
  function finalAccuracy(userInput,textLength){
    function correctSymbols(input,textLength){
      let correct = 0;
      for (let i = 0; i <= textLength-1; i++){
            if (input[i] === text[i]){correct++}
      }
      return correct
    }
    let correct = correctSymbols(userInput,textLength);
    let acc = (correct/textLength)*100
    return (Math.round((acc + Number.EPSILON) * 100) / 100)
  }
  //gather real accuracy
  //backspacing on incorrect chars does not effect error count
  function finalRealAccuracy(userInputLength,text,errors){
    let typed = (userInputLength)-errors
    let acc = (typed/text.length)*100
    return (Math.round((acc + Number.EPSILON) * 100) / 100)
  }
  //check if length of input is equal to given text
  async function onFinish() {
    if (text.length - 1 === userInput.length) {
      clearInterval(interval);
      // call popup
      setPopup(true);
      setFinished(true);
      setStarted(false);
      // add new wpm entry to db under wpmHistory
      if (loggedIn) {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();
  
        const a = [...userData.logs.wpmHistory, finalWpm(errors, symbols + 1, sec)];
        const b = [...userData.logs.rawWpmHistory, finalRawWpm(symbols + 1, sec)];
        const c = [...userData.logs.realAccuracyHistory, finalRealAccuracy(userInput.length + 1, text, errors)];
        const d = [...userData.logs.accuracyHistory, finalAccuracy(userInput, text.length - 1)];
        const e = [...userData.logs.errorHistory, errors];
  
        if (a === "Infinity" || a >= 300 || isNaN(a)) {
          await updateDoc(userDocRef, {
            logs: {
              wpmHistory: 0,
              rawWpmHistory: b,
              realAccuracyHistory: 0,
              accuracyHistory: 0,
              errorHistory: 0
            }
          });
        } else {
          await updateDoc(userDocRef, {
            logs: {
              wpmHistory: a,
              rawWpmHistory: b,
              realAccuracyHistory: c,
              accuracyHistory: d,
              errorHistory: e
            }
          });
        }
      }
    }
  }
  
  //if restart button clicked in popup
  function restartPopup(){
    setSec(0)
    setStarted(false)
    setSymbols(0)
    setError(0)
    setPopup(false)
    setFinished(false)
    setUserInput("")
  }
  //if close button clicked in popup
  function nextPopup(){
    setSec(0)
    setStarted(false)
    setSymbols(0)
    setError(0)
    setPopup(false)
    setFinished(false)
    setUserInput("")
    setText(loggedIn ? GetText(wordCount,englishType) : GetText(localStorage.getItem('wordCount'),localStorage.getItem('englishType')))
  }
  //timer
  function setTimer() {
    if (!started) {
      setStarted(true);
      interval = setInterval(() => {
        setSec(prevSec => prevSec + 1)
      }, 1000)
    }
  }
  return (
    <div className="app">
      <div className="container mt-5 mb-5">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <div>
              <Link style={{textDecoration:"none"}}to='/'>
                <h1 className="quick-type-home-horizontal">Quick Type</h1>
              </Link>
              <form className="input-group nav-bar" style={{position:"absolute"}}>
                <div>
                  <Link to="/leader-board">
                    <FaCrown size={19} className="leaderboard-icon"/>
                  </Link>
                </div>
                { currentUser !== null &&
                <div>
                  <Link to='/settings' >
                      <IoSettingsSharp size={18} className="settings-icon"/>
                  </Link>
                </div>
                } 
                { currentUser === null &&
                <div>
                  <Link to='/signup'>
                    <FaUserPlus style={{position:"relative",left:"3px"}} size={20} className="addUser-icon"/>
                  </Link>
                </div>
                }
                { currentUser === null &&
                  <div>
                    <Link to='/login'>
                      <IoLogIn size={22} className="login-icon"/>
                    </Link>
                  </div>}
                { currentUser !== null && 
                  <div>
                    <Link to="/stats">
                      <IoStatsChart  size={18} className="stats-icon"/>
                    </Link>
                  </div>
                }
                { currentUser !== null && 
                  <div style={{color: 'white'}}>
                    <IoLogOut size={22} onClick={handleLogout} className="logout-icon"/>
                  </div>}
              </form>
            </div>
            <div>
              {text.split(" ").length == localStorage.getItem("wordCount") &&
                <Preview wordCount={loggedIn ? wordCount : localStorage.getItem('wordCount')} text={text} userInput={userInput}/>
              }
            </div>
            <form className="row g-4">
              <div className="col-auto">
                <input
                  autoComplete="off" 
                  autoCorrect="off" 
                  autoCapitalize="off" 
                  spellCheck="false"
                  value={userInput}
                  onChange={onUserInputChange}
                  className="form-control mb-4 inputField"
                  placeholder="Start typing..."
                  readOnly={finished}
                ></input>
              </div>
              <div className="col-auto">
                <button className="btn btn-dark buttons" onClick={newText}>New</button>
              </div>
              <div className="col-auto">
                <Wpm EnglishType={loggedIn ? englishType : localStorage.getItem('englishType')} errors={errors} userInput={userInput} sec={sec} symbols={symbols}/>
              </div>
              <div className="col-auto" style={{marginLeft:"-20px"}}>
                <Accuracy sec={sec} userInput={userInput} text={text}/>
              </div>
            </form>
          </div>
        </div>
        <script src="js/jquery-1.11.2.min.js"></script> 
        <script src="js/bootstrap.min.js"></script>
      </div>
      <div>
      <Popup 
      trigger={popup} 
      state={{errors,sec,symbols,text,userInput}} 
      next={nextPopup} 
      restart={restartPopup} 
      accuracy={finalAccuracy} 
      realAccuracy={finalRealAccuracy} 
      wpm={finalWpm}
      rawWpm={finalRawWpm}
      />
      </div>
      <div className="text-center p-3 footer" style={{backgroundColor: "#6e6b6b"}}>
        © 2022 Copyright:
        <a className="text-reset fw-bold"> PandaBros</a>
      </div>
    </div>
  );  
}
export default Home;