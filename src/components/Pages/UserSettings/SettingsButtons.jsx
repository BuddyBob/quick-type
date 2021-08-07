import React, { useState, useEffect } from 'react'
import { db } from '../../../firebase'
import { Label } from '../../Label'
import styled from 'styled-components'
import './Settings.css'
const SettingsButtons = ({dbData,change,types}) => {
    const userId = localStorage.getItem('currentUserId')
    const [Alert, setAlert] = useState([false,"No Error"])
    const [active, setActive] = useState()
    let [data, setData] = useState(dbData)
    useEffect(async () =>{
        await db.collection("users").doc(userId).get().then(async (doc) => {
            await setActive(change==="englishType" ? doc.data().englishType : "")
        })
    },[])
    //wordCount is updated "on change"
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
        localStorage.setItem("wordCount",val)
        dbData = data
    }

    const Btn = styled.button`
        border: none;
        background: #323437;
        color: #ffdc7a !important;
        font-weight: 200;
        padding: 18px;
        border-radius: 6px;
        display: inline-block;
        transition: all 0.3s ease 0s;
    `
    const BtnToggle = styled(Btn)`
        opacity: 0.5;
        border-color: white;
        ${({ active }) => 
        active && `
        border:2px solid;
        border-color:#ffdc7a;
        opacity:5;
        `}
    `
    async function btnClicked(type){
        setActive(type)
        await db.collection("users").doc(userId).update({englishType:type})
        localStorage.setItem("englishType",type)
    }
    function BtnGroup(){
        return  (
        <div style={{position:"relative",left:"30px", padding:"5px"}}>
        {types.map(type => (
            <BtnToggle style={{margin:"5px"}}active={active===type} onClick={() => btnClicked(type)}>{type}</BtnToggle>
        ))}
        </div>
        )
    }
    return (
        <div>
            { Alert[0] &&
            <div className="container">
                <div className="row" id="danger-container">
                    <div className="span20">
                        <div className="alert alert-danger alert-dismissible" role="alert">
                            <h5 className="alert-heading">OOPS</h5>
                            <span style={{fontSize:"15px"}}>{Alert[1]}</span>
                            <button onClick={() => {setAlert([false,null])}} type="button" className="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">x</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            }
        {change === "englishType" &&
            <form>
                <div className="row">
                    <div className="col mt-3 englishType-label" style={{left:"20px"}}>
                        <Label type="label" >{change}</Label>
                    </div>
                </div>
                <div className="row btnGroup">
                    {BtnGroup()}
                </div>
            </form>
        }
        {change === "wordCount" &&
            <form>
                <div className="row">
                    <div className="col mt-3 wordCount-label">
                        <Label type="label" >{change}</Label>
                    </div>
                </div>
                <div className="row">
                    <input className="wordCount-input" onChange={changed} placeholder={dbData ? dbData.wordCount : null} type="text" />
                </div>
            </form>
        }
        </div>
    )
}
export default SettingsButtons;