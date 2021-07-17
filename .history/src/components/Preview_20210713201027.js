import React from 'react';
const Preview = (props) => {
    let t = props.text.split(' ').splice(0,props.wordCount)
    let text = []
    for (var word of t){
        for (var letter of word){
            text.push(letter)
        }
        text.push(" ")
    }
    let userInput = props.userInput.split('');
    const divStyle = {
        fontSize: localStorage.getItem('wordCount') === "60" ? "1rem" : "1.4rem",
        fontFamily:'Roboto Mono',
        fontWeight: 'bold',
        color: "#ede8e8",
    }
    let ci = []
    return (
        <div>
            <div style={divStyle} className="border rounded p-3 mb-4">
                {
                    text.map((s,i) => {
                        let foreground;
                        if (i < props.userInput.length){if (s===userInput[i]){foreground = "#5dba84";ci.push(true)} else{foreground="#f74566";ci.push(false)}}
                        return <span style={{padding:".5px",background: foreground,userSelect: "none"}}>{s}</span>
                    })
                }
            </div>
        </div>
    )
}
export default Preview;