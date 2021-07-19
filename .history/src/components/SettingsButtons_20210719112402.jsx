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
    let [data, setData] = useState(dbData)
    async function changed(e){
        const val = e.target.value;
        if (changed === "wordCount"){await db.collection("users").doc(userId).update({wordCount:val})}
        else if (changed === "englishType"){await db.collection("users").doc(userId).update({englishType:val})}
        db.collection("users").doc(userId).get().then((doc) => {setData(doc.data())})
        dbData = data
    }
    return (
        <div>
        { change == "wordCount" &&
            <div>
                <input onChange={changed}  placeholder={dbData ? dbData.wordCount : null} type="text" style={{width:"250px",marginBottom:"20px"}}/>
            </div>
        }
        { change == "englishType" &&
            <div>
                <input onChange={changed} placeholder={dbData ? dbData.englishType : null} type="submit" style={{width:"250px",marginBottom:"20px"}}/>
            </div>
        }
        </div>
    )
}
export default SettingsButtons;
