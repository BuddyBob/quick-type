
import ToggleGroup from '../SettingsButtons';
import NavBar from '../Nav/NavBar';
import React, { useState, useEffect } from 'react'
import { Label } from '../Label'
import { db } from '../../firebase'
import { useAuth } from '.././context/AuthContext'
function returnUserData(userId){
    let docRef = db.collection("users").doc(userId)
    return docRef.get().then((doc) => {
      if (doc.exists) {
          doc.data()
          return doc.data();
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
  }
const Settings = (props) => {
    const { currentUser } = useAuth()
    const [wordCount,setWordCount] = useState()
    const [englishType,setEnglishType] = useState()
    const [doc, setDoc] = useState()

    useEffect(() => {
    returnUserData(currentUser.uid).then(result => {
        setWordCount(result.wordCount)
    })
    }, [])
    console.log(doc)
    // db.collection('users').doc(currentUser.uid).get().then((docRef) => { console.log("DBDBDBDBDBDB",docRef.wordCount)})
    db.collection('users').doc(currentUser.uid).get().then((docRef) => { setEnglishType(docRef.englishType); })
    return (
        <div>   
            <NavBar/>
            <div>
                <h1 className="settings-title">Settings</h1>
            </div>
            <div className="wordCount-container">
                <Label type="label">Word Count</Label>
                <ToggleGroup dbData={wordCount} additionalText={" words"} runFunction={'changeWordCount'} change={"wordCount"} types={['10','15','60']}/>
            </div>
            <div className="wordCount-container">
                <Label type="label">English Type</Label>
                <ToggleGroup dbData={englishType} additionalText={""} runFunction={"changeEnglishType"} change={"englishType"} types={['english','english1k','english2k']}/>
            </div>
            
        </div>
        );
}
export default Settings;
  