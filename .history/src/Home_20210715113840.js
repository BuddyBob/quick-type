import React, { Component, useState, useEffect, useRef } from 'react';
import Preview from './components/Preview';
import Wpm from './components/Wpm';
import Accuracy from './components/Accuracy';
import GetText from './components/GetText';
import Popup from './components/Popup/Popup'
import { Link } from 'react-router-dom';
import { IoSettingsSharp } from 'react-icons/io5'
import { FaInfo } from 'react-icons/fa'
import { FaUserPlus } from 'react-icons/fa'
import { IoLogIn } from 'react-icons/io5'
function setData(){
  if (localStorage.getItem("wordCount")) {
    console.log("WORD COUNT ",localStorage.getItem("wordCount"))
  }else{
      localStorage.setItem("wordCount","10")
  }
  if (localStorage.getItem("englishType")){
    console.log("ENGLISH TYPE",localStorage.getItem("englishType"))
  }else{
    localStorage.setItem("englishType","english")
  }
}
setData()
let interval = null
const Home = () =>  {
    const [userStatusLoggedIn,setUserStatusLoggedIn] = useState(false)
    const [englishType,setEnglishType] = useState(localStorage.getItem("englishType"))
    const [popup, setPopup] = useState(false)
    const [userInput,setUserInput] = useState('')
    const [previousUserInput, setPreviousUserInput] = useState('') 
    const [symbols, setSymbols] = useState(0)
    const [sec, setSec] = useState(0)
    console.log("SEC RESET",sec)
    const [errors,setError] = useState(0)
    const [started, setStarted] = useState(false)
    const [finished, setFinished] = useState(false)
    const [text,setText] = useState(GetText(localStorage.getItem('wordCount'),localStorage.getItem('englishType')))
    function useInterval(callback, delay) {
      const savedCallback = useRef();
    
      // Remember the latest callback.
      useEffect(() => {
        savedCallback.current = callback;
      }, [callback]);
    
      // Set up the interval.
      useEffect(() => {
        let id = setInterval(() => {
          savedCallback.current();
        }, delay);
        return () => clearInterval(id);
      }, [delay]);
    }
  function newThing(){
  }
  function onUserInputChange(e){
    const v = e.target.value;
    if ((v.length>previousUserInput.length) && (v[v.length-1]!==text[v.length-1])){
      setError(errors + 1)
    }
    setPreviousUserInput(v)

    setTimer();
    onFinish()
    setUserInput(v)
    setSymbols(symbolCount(v).length)
  }
  function symbolCount(userInput){return userInput}

  function finalWpm(errors,sym,time){
    let GrossWpm = (sym/5) / (time/60);
    let ErrorRate = (errors)/(time/60)
    let NetWpm = (GrossWpm-ErrorRate)
    if (NetWpm < 0){NetWpm = 0}
    return (Math.round(NetWpm))
  }
  function finalRawWPM(sym,time){
    let GrossWpm = (sym/5) / (time/60);
    if (GrossWpm < 0){GrossWpm = 0}
    return (Math.round(GrossWpm))
  }
  function finalAccuracy(userInput,text){
    function correctSymbols(input,text){
      let correct = 0;
      for (let i = 0; i <= text.length-1; i++){
            if (input[i] === text[i]){correct++}
      }
      return correct
    }
    let correct = correctSymbols(userInput,text);
    let acc = (correct/text.length)*100
    return (Math.round((acc + Number.EPSILON) * 100) / 100)
  }
  function finalRealAccuracy(userInput,text,errors){
    let typed = userInput.length-errors
    let acc = (typed/text.length)*100
    return (Math.round((acc + Number.EPSILON) * 100) / 100)
  }
  
  function onFinish() {
    if (text.length-1 === symbols) {
      clearInterval(interval);
      setPopup(true)
      setFinished(true)
      setStarted(false)
    }
  }
  function restartPopup(){
    setSec(0)
    setSymbols(0)
    setError(0)
    setPopup(false)
    setFinished(false)
    setUserInput("")
  }
  function closePopup(){
    setSec(0)
    setSymbols(0)
    setError(0)
    setPopup(false)
    setFinished(false)
    setUserInput("")
    setText(GetText(localStorage.getItem('wordCount'),localStorage.getItem('englishType')))
  }

  function setTimer() {
    if (!started) {
      setStarted(true);
      interval = useInterval(() => {
        setSec(sec+1)
        console.log("ADDED",sec)
      }, 1000)
    }
  }
  
  return (
    <div className="app">
      <div className="container mt-5 mb-5" style={{width:'100%'}}>
      <div>
      </div>
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <div>
              <Link style={{textDecoration:"none"}}to='/'>
                <h1 className="quick-type-home-horizontal">Quick Type</h1>
              </Link>
              <form className="form-group nav-bar" style={{position:"absolute"}}>
                <div className="col-auto">
                  <Link to='/info'>
                      <FaInfo className="info-icon"/>
                  </Link>
                </div>
                <div className="col-auto">
                  <Link to='/settings'>
                      <IoSettingsSharp className="settings-icon"/>
                  </Link>
                </div>
                <div className="col-auto">
                  <Link to='/signup'>
                    <FaUserPlus className="addUser-icon"/>
                  </Link>
                </div>
                <div className="col-auto">
                  <Link to='/signup'>
                    <IoLogIn className="login-icon"/>
                  </Link>
                </div>
              </form>
            </div>
            <div style={{focus:"2"}}>
            <Preview wordCount={localStorage.getItem('wordCount')} text={text} userInput={userInput}/>
            </div>
            <form className="row g-4">
              <div className="col-auto">
                <input
                  autoFocus
                  value={userInput}
                  onChange={onUserInputChange}
                  className="form-control mb-4 inputField"
                  placeholder="Start typing..."
                  readOnly={finished}
                ></input>
              </div>
              <div className="col-auto">
                <button className="btn btn-dark buttons" onClick={newThing}>New</button>
              </div>
              <div className="col-auto">
                <Wpm errors={errors} userInput={userInput} sec={sec} symbols={symbols}/>
              </div>
              <div className="col-auto" style={{marginLeft:"-20px"}}>
                <Accuracy  sec={sec} userInput={userInput} text={text}/>
              </div>
            </form>
          </div>
        </div>
        <script src="js/jquery-1.11.2.min.js"></script> 
        <script src="js/bootstrap.min.js"></script>
      </div>
      <Popup 
      trigger={popup} 
      state={{errors,sec,symbols,text,userInput}} 
      close={closePopup} 
      restart={restartPopup} 
      accuracy={finalAccuracy} 
      realAccuracy={finalRealAccuracy} 
      wpm={finalWpm}
      rawWpm={finalRawWPM}>
        <h3 className="popup-title">Results</h3>
      </Popup>
    </div>
  );  
}
export default Home;