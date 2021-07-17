import React, { useState , useEffect} from 'react';
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
import { IoLogOut } from 'react-icons/io5'
import { useAuth } from './components/context/AuthContext'
import { db } from './firebase'
localStorage.clear();
function setData(){
  console.log("CURRENT USER ID",localStorage.getItem("currentUserId"))
  //setData if user is not logged in
  if (localStorage.getItem("currentUserId") === null){
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
}
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

setData()
let interval = null
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
  const [popup, setPopup] = useState(false)
  const [userInput,setUserInput] = useState('')
  const [previousUserInput, setPreviousUserInput] = useState('') 
  const [symbols, setSymbols] = useState(0)
  const [errors,setError] = useState(0)
  const [finished, setFinished] = useState(false)
  const [sec,setSec] = useState(0)
  const [started,setStarted] = useState(false)
  const [registerError,setRegError] = useState("")


  //get new text
  function newText(){
    setText(loggedIn ? GetText(wordCount,englishType) : GetText(localStorage.getItem('wordCount'),localStorage.getItem('englishType')))
  }
  //logout
  async function handleLogout(){
    setRegError('')
    try{
      await logout()
      setEnglishType("english")
      setWordCount("15")
      localStorage.setItem("englishType","english")
      localStorage.setItem("wordCount","15")
      setLoggedIn(false)
      setUserId(null)
      console.log("LOGGED OUT")
      localStorage.removeItem("currentUserId");


    }catch{
      setRegError('failed to log out')
    }
  }
  //run function as input feild changes
  function onUserInputChange(e){
    const v = e.target.value;
    //check if error occured
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
  function finalRawWPM(sym,time){
    let GrossWpm = (sym/5) / (time/60);
    if (GrossWpm < 0){GrossWpm = 0}
    return (Math.round(GrossWpm))
  }
  //gathers fake accuracy 
  //compares the final result to the given text
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
  //gather real accuracy
  //backspacing on incorrect chars does not effect error count
  function finalRealAccuracy(userInput,text,errors){
    let typed = userInput.length-errors
    let acc = (typed/text.length)*100
    return (Math.round((acc + Number.EPSILON) * 100) / 100)
  }
  //check if length of input is equal to given text
  function onFinish() {
    if (text.length-1 === symbols) {
      clearInterval(interval);
      //call popup
      setPopup(true)
      setFinished(true)
      setStarted(false)
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
  function closePopup(){
    setSec(0)
    setStarted(false)
    setSymbols(0)
    setError(0)
    setPopup(false)
    setFinished(false)
    setUserInput("")
    setText(loggedIn ? GetText(wordCount,englishType) : GetText(localStorage.getItem('wordCount'),localStorage.getItem('englishType')))
  }
  //too confuzling
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
      <div className="container mt-5 mb-5" style={{width:'100%'}}>
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
                { currentUser === null &&
                <div className="col-auto">
                  <Link to='/signup'>
                    <FaUserPlus className="addUser-icon"/>
                  </Link>
                </div>
                }
                { currentUser === null &&
                  <div className="col-auto">
                    <Link to='/login'>
                      <IoLogIn className="login-icon"/>
                    </Link>
                  </div>}
                { currentUser !== null && <div className="col-auto"><IoLogOut onClick={handleLogout} className="logout"/></div>}
              </form>
            </div>
            <div style={{focus:"2"}}>
            <Preview wordCount={loggedIn ? wordCount : localStorage.getItem('wordCount')} text={text} userInput={userInput}/>
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