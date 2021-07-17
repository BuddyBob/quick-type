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
    const [active, setActive] = useState(types[0]);
    useEffect(()=>{
        if (dbData){
            setWordCount(dbData.wordCount)
        }else{
            db.collection("users").doc(currentUser.uid).get().then((doc) => {
                setWordCount(doc.wordCount)
            })
        }
    },[dbData])

    useEffect(() => {
        if (change === 'wordCount'){
            // setWordCount(data)
            console.log(active)
            db.collection("users").doc(currentUser.uid).update({wordCount:active})
            setWordCount(active)
        }
        if (change === 'englishType'){
        }
    })
    // if (wrdCount === undefined){return (<div></div>)}
    console.log(wrdCount)
    function setIndex(){
        if (wrdCount){
            setActive(types[types.indexOf(wrdCount)])
        }
    }
    // setIndex
    return (
        <div>
        { active &&
            <div>
                {types.map((type) => (
                <ButtonToggle active={active === type} onClick={() => setActive(type)}>
                    {type+additionalText}
                </ButtonToggle>
                ))}
            </div>
        }
        </div>
    )
}
export default SettingsButtons;
