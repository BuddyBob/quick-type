import React, { useState, useEffect } from 'react'
import Reload from './Reload'
import styled from 'styled-components'
import { useAuth } from './context/AuthContext'
import { db } from '../firebase'
const SettingsButtons = ({dbData, runFunction, types, change, additionalText}) => {
    const Button = styled.button`
    background-color: ${(props) => theme[props.theme].default};
    color:${(props) => theme[props.theme].hover};
    padding:5px 5px;
    margin: 3px;
    border-color: #ede8e8;
    font-family: "Roboto Mono",sans-serif;
    font-weight:400;
    border-radius:6px;
    cursor:pointer;
    outline:0;
    transition: ease background-color 250ms;
    &:hover { 
        background-color:${(props) => theme[props.theme].hover}; 
        color:${(props) => theme[props.theme].default};
    }
    `
    Button.defaultProps = {theme: "dark"}
    const ButtonToggle = styled(Button)`opacity: 0.3; ${({ active }) => active && `opacity: 1; `}`;
    const theme = {
        dark: {
            default: '#2D2F31',
            hover: '#ede8e8'
        }
    }
    const userId = localStorage.getItem('currentUserId')
    const { currentUser } = useAuth();
    let [wrdCount,setWordCount] = useState()
    let [englishType, setEnglishType] = useState()
    useEffect(()=>{
        if (dbData){
            setWordCount(dbData.wordCount)
        }else{
            db.collection("users").doc(currentUser.uid).get().then((doc) => {
                setWordCount(doc.wordCount)
            })
        }
    },[dbData])

    function toRun(kind,data){
        if (kind === 'changeWordCount'){
            // setWordCount(data)
            console.log('hello')
            db.collection("users").doc(currentUser.uid).update({wordCount:data})
        }
        if (kind === 'changeEnglishType'){
        }
    }
    // if (wrdCount === undefined){return (<div></div>)}
    console.log(wrdCount)
    const [active, setActive] = useState(types[index]);
    return (
        <div>
        { active &&
            <div>
                {types.map((type) => (
                <ButtonToggle active={active === type} onClick={() => setActive(type)}>
                    {type+additionalText}
                </ButtonToggle>
                ))}
                {toRun(runFunction,active.split(' ')[0])}
            </div>
        }
        </div>
    )
}
export default SettingsButtons;
