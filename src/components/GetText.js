import wordData from './english/english.json'
const GetText = (wordCount,englishType) => {
    let wordList = []
    for (let i = 0; i <= wordCount-1; i++){wordList.push(wordData[englishType][Math.floor(Math.random() * wordData[englishType].length)])}
    return wordList.join(" ");

}
export default GetText;
