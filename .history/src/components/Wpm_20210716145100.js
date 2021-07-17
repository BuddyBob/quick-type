import React from 'react';
const Wpm = (props) => {
    const divStyle = {
        color: "#ede8e8",
        fontSize: "1.3rem",
        fontFamily:'Roboto Mono',
        fontWeight: 'bold',
        padding: "10px"
    }
    let user_inp = props.userInput
    if (user_inp !== 0 && props.sec !== 0) {
        let avgWord = 5;
        if (props.EnglishType === "english2k"){avgWord = 6}
        if (props.EnglishType === "english"){console.log('5');avgWord = 5}
        let GrossWpm = (props.symbols/6) / (props.sec/60);
        let ErrorRate = (props.errors)/(props.sec/60)
        let NetWpm = (GrossWpm-ErrorRate)
        if (NetWpm < 0){NetWpm = 0}
        return (
        <div style={divStyle}>{Math.round(NetWpm)} wpm</div>
        )
    }
    
    return null;
}
export default Wpm