import React from 'react';
//32 19.5 8
const Wpm = (props) => {
    const divStyle = {
        color: "#ede8e8",
        fontSize: "1rem",
        fontFamily:'Roboto Mono',
        fontWeight: 'bold',
        padding: "10px",
        left:"20px"
    }
    let user_inp = props.userInput
    if (user_inp !== 0 && props.sec !== 0) {
        let avgWord = 5;
        if (props.EnglishType === "english3k"){avgWord = 7}
        if (props.EnglishType === "english2k"){avgWord = 6}
        if (props.EnglishType === "english1k"){avgWord = 5}
        if (props.EnglishType === "english"){avgWord = 5}
        let GrossWpm = (props.symbols/avgWord) / (props.sec/60);
        let ErrorRate = (props.errors*.50)/(props.sec/60)
        let NetWpm = (GrossWpm-ErrorRate)
        if (NetWpm < 0){NetWpm = 0}
        return (
        <div style={divStyle}>{Math.round(NetWpm)} wpm</div>
        )
    }
    
    return null;
}
export default Wpm