import React, { useState, useEffect } from 'react'
import Reload from './Reload'
import styled from 'styled-components'
import firebase from '../firebase'
import { db } from '../firebase'
const SettingsButtons = ({runFunction, types, localStorageName, additionalText}) => {
    function returnUserData(userId){
        let docRef = db.collection("users").doc(userId)
        return docRef.get().then((doc) => {
          if (doc.exists) {
              console.log("DATA"+doc.data())
              return doc.data();
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
      }
      const userId = localStorage.getItem("currentUserId")
      const [englishType,setEnglishType] = useState(localStorage.getItem("englishType"))
      const [wordCount,setWordCount] = useState(localStorage.getItem("wordCount"))
      const [loggedIn,setLoggedIn] = useState(userId ? true : false)
      useEffect(() => {
        if (loggedIn){
            returnUserData(userId).then(result => {
            console.log("LOGGED IN")
            setEnglishType(result.englishType)
            setWordCount(result.wordCount)
            })
        }
      }, [])
    const theme = {
        dark: {
            default: '#2D2F31',
            hover: '#ede8e8'
        }
    }
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
    Button.defaultProps = {
        theme: "dark"
    }
    const ButtonToggle = styled(Button)`
    opacity: 0.3;
    ${({ active }) =>
        active &&
        `
        opacity: 1; 
    `}
    `;

    function toRun(kind,data){
        if (kind === 'changeWordCount'){
            if (loggedIn){
                userRef.update({wordCount:data})
                console.log("CHANGED WORD COUNT")
            }
            //make sure data is not the same 
            else if (data !== localStorage.getItem('wordCount')){
                localStorage.setItem('wordCount', data);
                Reload();
            }else{
                localStorage.setItem('wordCount', data);
            }
        }
        if (kind === 'changeEnglishType'){
            if (loggedIn){
                userRef.update({englishType:data})
                console.log("CHANGED ENGLISH TYPE")
            }
            else if (data !== localStorage.getItem('englishType')){
                localStorage.setItem('englishType', data);
                Reload();
            }else{
                localStorage.setItem('englishType', data);
            }
        }
        
    }
    let index;
    if (loggedIn && localStorageName === "wordCount"){
        console.log("WORDCOUNT TYPE CLICKED")
        index = types.indexOf(wordCount)
    }
    else if (loggedIn && localStorageName === "englishType"){
        console.log("ENGLISH TYPE CLICKED")
        index = types.indexOf(englishType)
    }
    else{
        index = types.indexOf(localStorage.getItem(localStorageName))
    }
    console.log(index)
    const [active, setActive] = useState(types[index]);
    return (
        <div>
            {types.map((type) => (
            <ButtonToggle active={active === type} onClick={() => setActive(type)}>
                {type+additionalText}
            </ButtonToggle>
            ))}
            <p>{toRun(runFunction,active.split(' ')[0])}</p>
        </div>
    )
}
export default SettingsButtons;
