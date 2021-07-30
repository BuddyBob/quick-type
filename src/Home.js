import React, { useState , useEffect} from 'react';
import Preview from './components/Preview';
import Wpm from './components/Wpm';
import Accuracy from './components/Accuracy';
import GetText from './components/GetText';
import Popup from './components/Popup/Popup'
import Reload from './components/Reload'
import SetData from './components/SetData'
import useSound from 'use-sound';
import assets from './assets'
import { Link } from 'react-router-dom';
import { IoSettingsSharp } from 'react-icons/io5'
import { FaUserPlus } from 'react-icons/fa'
import { IoLogIn } from 'react-icons/io5'
import { IoLogOut } from 'react-icons/io5'
import { IoStatsChart } from 'react-icons/io5'
import { FaCrown } from 'react-icons/fa'
import { useAuth } from './components/context/AuthContext'
import { db } from './firebase'
import './index.css';
import './NavImages.css'

function returnUserData(userId){
  let docRef = db.collection("users").doc(userId)
  return docRef.get().then((doc) => {
    if (doc.exists) {
        return doc.data();
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}
SetData()
let interval = null
const soundList = [assets.sounds.click2]
function getRandom(arr, n) {
  var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
  if (n > len)
      throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}
const Home = () =>  {
  // set hooks
  const { currentUser, logout } = useAuth()
  const [userId, setUserId] = useState(currentUser ? currentUser.uid : null)
  const [loggedIn,setLoggedIn] = useState(currentUser ? true : false)
  const [text,setText] = useState(GetText(localStorage.getItem('wordCount'),localStorage.getItem('englishType')))
  const [englishType,setEnglishType] = useState(localStorage.getItem("englishType"))
  const [wordCount,setWordCount] = useState(localStorage.getItem("wordCount"))
  useEffect(() => {
    if (loggedIn){
      returnUserData(userId).then(result => {
        setText(GetText(result.wordCount,result.englishType))
        setEnglishType(result.englishType)
        setWordCount(result.wordCount)
      })
    }
  }, [])
  const [play] = useSound(getRandom(soundList,1));
  const [popup, setPopup] = useState(false)
  const [userInput,setUserInput] = useState('')
  const [previousUserInput, setPreviousUserInput] = useState('') 
  const [symbols, setSymbols] = useState(0)
  const [errors,setError] = useState(0)
  const [finished, setFinished] = useState(false)
  const [sec,setSec] = useState(0)
  const [started,setStarted] = useState(false)
  const [registerError,setRegError] = useState('')

  //get new text
  function newText(event){
    event.preventDefault()
    Reload()
  }
    //logout
  async function handleLogout(){
    setRegError('')
    try{
      await logout()
      setEnglishType("english1k")
      setWordCount("30")
      localStorage.setItem("englishType","english1k")
      localStorage.setItem("wordCount","30")
      setLoggedIn(false)
      setUserId(null)
      console.log("LOGGED OUT")
      localStorage.removeItem("currentUserId");
      Reload()


    }catch{
      setRegError('failed to log out')
    }
  }
  //run function as input feild changes
  function onUserInputChange(e){
    play()
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
    let ErrorRate = (errors)/(time/60)
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
    if (text.length-1 === userInput.length) {
      clearInterval(interval);
      //call popup
      setPopup(true)
      setFinished(true)
      setStarted(false)
      //add new wpm entry to db under wpmHistory
      if (loggedIn){
        await db.collection("users").doc(userId).get().then(async (doc) => {
            const a = await doc.data().logs.wpmHistory
            a.push(finalWpm(errors,symbols+1,sec))
            const b = await doc.data().logs.rawWpmHistory
            b.push(finalRawWpm(symbols+1,sec))
            const c = await doc.data().logs.realAccuracyHistory
            c.push(finalRealAccuracy(userInput.length+1,text,errors))
            const d = await doc.data().logs.accuracyHistory
            d.push(finalAccuracy(userInput,text.length-1))
            const e = await doc.data().logs.errorHistory
            e.push(errors)
            db.collection("users").doc(userId).update({logs:{wpmHistory:a,rawWpmHistory:b,realAccuracyHistory:c,accuracyHistory:d,errorHistory:e}})
        })
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
              <Preview wordCount={loggedIn ? wordCount : localStorage.getItem('wordCount')} text={text} userInput={userInput}/>
            </div>
            <form className="row g-4">
              <div className="col-auto">
                <input
                  autoFocus
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
      <Popup 
      trigger={popup} 
      state={{errors,sec,symbols,text,userInput}} 
      next={nextPopup} 
      restart={restartPopup} 
      accuracy={finalAccuracy} 
      realAccuracy={finalRealAccuracy} 
      wpm={finalWpm}
      rawWpm={finalRawWpm}>
      <h3 className="popup-title">Results</h3>
      </Popup>
      

    </div>
  );  
}
export default Home;