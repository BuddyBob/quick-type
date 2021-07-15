import React, { Component } from 'react';
import Preview from './components/Preview';
import Wpm from './components/Wpm';
import Accuracy from './components/Accuracy';
import GetText from './components/GetText';
import Popup from './components/Popup'
import { Link } from 'react-router-dom';
import { IoSettingsSharp } from 'react-icons/io5'
import { FaInfo } from 'react-icons/fa'
import { FaUserPlus } from 'react-icons/fa'
import { IoLogIn } from 'react-icons/io5'
import { useAuth } from './components/context/AuthContext'
setData()
let initialState = {
  englishType:localStorage.getItem("englishType"),
  popup:false,
  userInput: '',
  previousUserInput:'',
  symbols: 0,
  sec: 0,
  errors:0,
  started: false,
  finished: false,
  text: GetText(localStorage.getItem('wordCount'),localStorage.getItem('englishType'))
}
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

// const [thing, setState] = useState([
const Signup = (props) =>  {
  const state = initialState;
  function newThing(){
    state.setState(initialState)
  }
  function onUserInputChange(e){
    const v = e.target.value;
    if ((v.length>state.previousUserInput.length) && (v[v.length-1]!==state.text[v.length-1])){
      state.setState({errors:this.state.errors + 1})
    }
    state.setState({previousUserInput:v})

    setTimer();
    onFinish()
    state.setState({
      userInput: v,
      symbols: symbolCount(v).length
    })
  }
  function symbolCount(userInput){return userInput}

  function finalWPM(errors,sym,time){
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
    let acc = (typed/text.length)*10
    return (Math.round((acc + Number.EPSILON) * 100) / 100)
  }
  
  function onFinish() {
    if (state.text.length-1 === state.symbols) {
      clearInterval(state.interval);
      setState({popup:true,finished:true,started:false})

    }
  }
  function restartPopup(){
    setState({sec: 0,symbols:0,errors:0,popup:false,finished:false,userInput:""})
  }
  function closePopup(){
    setState({sec:0,symbols:0,errors:0,popup:false,finished:false,text:GetText(localStorage.getItem('wordCount'),localStorage.getItem('englishType')),userInput:""})
  }

   
  function setTimer() {
    if (!this.state.started) {
      setState({started: true});
      state.interval = setInterval(() => {
        setState(prevProps => {
          return {sec: prevProps.sec+1}
        })
      }, 1000)
    }
  }
  
  return (
    <div className="app">
      <strong>Email: </strong> {JSON.stringify(this.currentUser)}
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
                <div className="col-auto">
                  <Link to='/signup'>
                    <FaUserPlus className="addUser-icon"/>
                  </Link>
                </div>
                <div className="col-auto">
                  <Link to='/login'>
                    <IoLogIn className="login-icon"/>
                  </Link>
                </div>
              </form>
            </div>
            <div style={{focus:"2"}}>
            <Preview wordCount={localStorage.getItem('wordCount')} text={state.text} userInput={state.userInput}/>
            </div>
            <form className="row g-4">
              <div className="col-auto">
                <input
                  autoFocus
                  value={state.userInput}
                  onChange={onUserInputChange}
                  className="form-control mb-4 inputField"
                  placeholder="Start typing..."
                  readOnly={state.finished}
                ></input>
              </div>
              <div className="col-auto">
                <button className="btn btn-dark buttons" onClick={newThing}>New</button>
              </div>
              <div className="col-auto">
                <Wpm errors={state.errors} userInput={this.state.userInput} sec={this.state.sec} symbols={this.state.symbols}/>
              </div>
              <div className="col-auto" style={{marginLeft:"-20px"}}>
                <Accuracy  sec={state.sec} userInput={this.state.userInput} text={this.state.text}/>
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
export default Home;