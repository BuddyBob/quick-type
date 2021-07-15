import React, { Component } from 'react';
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
const Home = () =>  {
    setData();
    const [state, setStateInitial] = useState({
      userStatusLoggedIn:false,
      englishType:localStorage.getItem("englishType"),
      popup:false,
      userInput: '',
      previousUserInput:'',
      symbols: 0,
      sec: 0,
      errors:0,
      started: false,
      finished: false,
      text: GetText(localStorage.getItem('wordCount'),localStorage.getItem('englishType')),
      currentUser: null});
    const [userStatusLoggedIn,setUserStatusLoggedIn] = useState(false)
    const [englishType,setEnglishType] = useState(localStorage.getItem("englishType"))
    const [popup, setPopup] = useState(false)
    const [userInput,setUserInput] = useState('')
    const [previousUserInput, setPreviousUserInput] = useState('') 
    const [symbols, setSymbols] = useState(0)
    const [sec, setSec] = useState(0)
    const [errors,setErrors] = useState(0)
    const [started, setStarted] = useState(false)
    const [finished, setFinished] = useState(false)
    const [text,setText] = useState(GetText(localStorage.getItem('wordCount'),localStorage.getItem('englishType')))
  function newThing(){
    setInitialState()
  }
  function onUserInputChange(){
    const v = e.target.value;
    if ((v.length>previousUserInput.length) && (v[v.length-1]!==text[v.length-1])){
      setErrors(errors + 1)
    }
    setPreviousUserInput(v)

    this.setTimer();
    this.onFinish()
    this.setState({
      userInput: v,
      symbols: this.symbolCount(v).length
    })
  }
  symbolCount(userInput){return userInput}

  finalWPM(errors,sym,time){
    let GrossWpm = (sym/5) / (time/60);
    let ErrorRate = (errors)/(time/60)
    let NetWpm = (GrossWpm-ErrorRate)
    if (NetWpm < 0){NetWpm = 0}
    return (Math.round(NetWpm))
  }
  finalRawWPM(sym,time){
    let GrossWpm = (sym/5) / (time/60);
    if (GrossWpm < 0){GrossWpm = 0}
    return (Math.round(GrossWpm))
  }
  finalAccuracy(userInput,text){
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
  finalRealAccuracy(userInput,text,errors){
    let typed = userInput.length-errors
    let acc = (typed/text.length)*100
    return (Math.round((acc + Number.EPSILON) * 100) / 100)
  }
  
  onFinish() {
    if (this.state.text.length-1 === this.state.symbols) {
      clearInterval(this.interval);
      this.setState({popup:true,finished:true,started:false})

    }
  }
  restartPopup(){
    this.setState({sec: 0,symbols:0,errors:0,popup:false,finished:false,userInput:""})
  }
  closePopup(){
    this.setState({sec:0,symbols:0,errors:0,popup:false,finished:false,text:GetText(localStorage.getItem('wordCount'),localStorage.getItem('englishType')),userInput:""})
  }

   
  setTimer() {
    if (!this.state.started) {
      this.setState({started: true});
      this.interval = setInterval(() => {
        this.setState(prevProps => {
          return {sec: prevProps.sec+1}
        })
      }, 1000)
    }
  }
  
  render(){
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
              <Preview wordCount={localStorage.getItem('wordCount')} text={this.state.text} userInput={this.state.userInput}/>
              </div>
              <form className="row g-4">
                <div className="col-auto">
                  <input
                    autoFocus
                    value={this.state.userInput}
                    onChange={this.onUserInputChange}
                    className="form-control mb-4 inputField"
                    placeholder="Start typing..."
                    readOnly={this.state.finished}
                  ></input>
                </div>
                <div className="col-auto">
                  <button className="btn btn-dark buttons" onClick={this.newThing.bind(this)}>New</button>
                </div>
                <div className="col-auto">
                  <Wpm errors={this.state.errors} userInput={this.state.userInput} sec={this.state.sec} symbols={this.state.symbols}/>
                </div>
                <div className="col-auto" style={{marginLeft:"-20px"}}>
                  <Accuracy  sec={this.state.sec} userInput={this.state.userInput} text={this.state.text}/>
                </div>
              </form>
            </div>
          </div>
          <script src="js/jquery-1.11.2.min.js"></script> 
          <script src="js/bootstrap.min.js"></script>
        </div>
        <Popup 
        trigger={this.state.popup} 
        state={this.state} 
        close={this.closePopup.bind(this)} 
        restart={this.restartPopup.bind(this)} 
        accuracy={this.finalAccuracy.bind(this)}
        realAccuracy={this.finalRealAccuracy.bind(this)}
        wpm={this.finalWPM.bind(this)}
        rawWpm={this.finalRawWPM.bind(this)}>
          <h3 className="popup-title">Results</h3>
        </Popup>
      </div>
    );  
  }
}
export default Home;