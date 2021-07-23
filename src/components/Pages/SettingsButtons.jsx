import React, { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { db } from '../../firebase'
import { Label } from '../Label'
const SettingsButtons = ({dbData,change}) => {
    const userId = localStorage.getItem('currentUserId')
    const englishTypeRef = useRef()
    const [Alert, setAlert] = useState([false,"No Error"])
    let [data, setData] = useState(dbData)
    async function changed(e){
        const val = e.target.value;
        if (change === "wordCount"){
            function isNumeric(num){return !isNaN(num)}
            const isNum = isNumeric(val)
            switch (true){
                case isNum === false: 
                    setAlert([true,"You have not entered a valid number"])
                    break
                case val < 5: 
                    setAlert([true,"You have entered a number less 5"])
                    break
                default:
                    setAlert([false,"No Error"])
                    await db.collection("users").doc(userId).update({wordCount:val})
            }
        }
        db.collection("users").doc(userId).get().then((doc) => {setData(doc.data())})
        dbData = data
    }
    async function submitEnglishType(){
        const val = englishTypeRef.current.value
        if (change === "englishType" && ['english','english1k','english2k','english3k'].includes(val)){await db.collection("users").doc(userId).update({englishType:val})}
        else{setAlert([true,"It appears your have entered an incorrect english level. Choose the following - english1, english2k, english3k"])}
    }
    return (
        <div>
        { Alert[0] &&
        <div class="container">
            <div class="row" id="danger-container">
                <div class="span20">
                    <div class="alert alert-danger alert-dismissible" role="alert">
                        <h5 class="alert-heading">OOPS</h5>
                        <span styles={{fontSize:"2px"}}>{Alert[1]}</span>
                        <button onClick={() => {setAlert([false,null])}} type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">x</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        }
    {change === "englishType" &&
        <div className="container">
            <div className="row">
                <div className="col mt-3">
                    <Label type="label" >{change}</Label>
                </div>
            </div>
            <div className="row">
                <div class="input-group col-md-20">
                    <input ref={englishTypeRef} className="form-control p-3 settings-input" placeholder={dbData ? dbData.englishType : null}/>
                    <button type="submit" onClick={submitEnglishType}  class="btn btn-dark p-3" style={{backgroundColor:"#2D2F31",color:"#ffdc7a"}}>Update</button>
                </div>
            </div>
        </div>
    }
    {change === "wordCount" &&
        <div className="container">
            <div className="row">
                <div className="col mt-3">
                    <Label type="label" >{change}</Label>
                </div>
            </div>
            <div className="row">
                <input className="settings-input" onChange={changed} placeholder={dbData ? dbData.wordCount : null} type="text" />
            </div>
        </div>
    }
    </div>
    )
}
export default SettingsButtons;