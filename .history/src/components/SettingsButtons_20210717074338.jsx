import React, { useState, useEffect } from 'react'
import Reload from './Reload'
import styled from 'styled-components'
import { useAuth } from './context/AuthContext'
import { db } from '../firebase'
const SettingsButtons = ({dbData, runFunction, types, change, additionalText}) => {
    console.log("DATA",dbData)
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
    // if (dbData){
    //     setEnglishType(dbData.englishType)
    //     setWordCount(dbData.wordCount)
    // }
    // console.log(wrdCount,englishType)
    useEffect(()=>{
    if (dbData){
        setWordCount
    }
    

    // function toRun(kind,data){
    //     if (kind === 'changeWordCount'){
    //         db.collection('users').doc(currentUser.uid).get().then((docRef) => { setWordCount(docRef.wordCount) })
    //         console.log("got data from database")
    //     }
    //     if (kind === 'changeEnglishType'){
    //     }
    // }


    const [active, setActive] = useState(types[types.indexOf(dbData)]);
    return (
        <div>
            {types.map((type) => (
            <ButtonToggle active={active === type} onClick={() => setActive(type)}>
                {type+additionalText}
            </ButtonToggle>
            ))}
            {/* <p>{toRun(runFunction,active.split(' ')[0])}</p> */}
        </div>
    )
}
export default SettingsButtons;
