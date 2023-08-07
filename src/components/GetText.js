
const GetText = (wordCount,englishType) => {
    console.log(englishType)
    if (englishType === null){
        englishType = "english1k"
        localStorage.setItem("englishType","english1k")
    }
    const wordData = require(`./english/${englishType}.json`); 
    let wordList = []
    for (let i = 0; i <= wordCount-1; i++){wordList.push(wordData[englishType][Math.floor(Math.random() * wordData[englishType].length)])}
    return wordList.join(" ");

}
export default GetText;
