import React, { useState } from 'react'
import Reload from './Reload'
import styled from 'styled-components'
const ToggleGroup = ({runFunction, types, localStorageName, additionalText}) => {
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
            if (data !== localStorage.getItem('wordCount')){
                localStorage.setItem('wordCount', data);
                Reload();
            }
        }
        if (kind === 'changeEnglishType'){
            if (data !== localStorage.getItem('englishType')){
                localStorage.setItem('englishType', data);
                Reload();
            }else{
                localStorage.setItem('englishType', data);
            }
        }
        
    }

    const index = types.indexOf(localStorage.getItem(localStorageName))
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
export default ToggleGroup;
