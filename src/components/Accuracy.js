import React from 'react';
const Accuracy = (props) => {
    const divStyle = {
        color: "#ede8e8",
        fontSize: "1.3rem",
        fontFamily:'Roboto Mono',
        fontWeight: 'bold',
        padding: "10px"
    }
    function correctSymbols(input,text){
        let correct = 0;
        for (let i = 0; i <= text.length-1; i++){
              if (input[i] === text[i]){correct++}
        }
        return correct
      }

    if (props.userInput.length !== 0 && props.sec !== 0) {
        let correct = correctSymbols(props.userInput,props.text.slice(0,props.userInput.length))
        let acc = (correct/props.text.slice(0,props.userInput.length).length)*100
        return (
            <div style={divStyle}>{Math.round((acc + Number.EPSILON) * 100) / 100}%</div>
        )
    }
    return null;
}
export default Accuracy