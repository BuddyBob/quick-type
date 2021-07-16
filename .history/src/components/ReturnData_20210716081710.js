export default function ReturnData(userId){
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
    useEffect(() => {
        returnUserData(userId).then(result => {
          console.log("LOGGED IN")
          setText(GetText(result.wordCount,result.englishType))
          setEnglishType(result.englishType)
          setWordCount(result.wordCount)
        })
    }, [])
    return 
}