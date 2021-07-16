export default function ReturnData(userId){
    useEffect(() => {
        returnUserData(userId).then(result => {
          console.log("LOGGED IN")
          setText(GetText(result.wordCount,result.englishType))
          setEnglishType(result.englishType)
          setWordCount(result.wordCount)
        })
    }, [])
}