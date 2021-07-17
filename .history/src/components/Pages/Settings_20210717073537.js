
import ToggleGroup from '../SettingsButtons';
import NavBar from '../Nav/NavBar';
import React, { useState, useEffect } from 'react'
import { Label } from '../Label'
import { db } from '../../firebase'
import { useAuth } from '.././context/AuthContext'

const Settings = (props) => {
    const { currentUser } = useAuth()
    const [wordCount,setWordCount] = useState()
    const [englishType,setEnglishType] = useState()
    const [data, setData] = useState()
    useEffect(() => {
        db.collection("users").doc("0850Op6lSBMBBSUioz8v0NboDez1").get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                setData(doc.data())
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        
      }, [])
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
  