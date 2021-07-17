
import ToggleGroup from '../SettingsButtons';
import NavBar from '../Nav/NavBar';
import React, { useState } from 'react'
import { Label } from '../Label'
import { db } from '../../firebase'
import { useAuth } from '.././context/AuthContext'

const Settings = (props) => {
    const { currentUser } = useAuth()
    const [wordCount,setWordCount] = useState('')
    const [englishType,setEnglishType]
    db.collection('users').doc(currentUser.uid).get().then((docRef) => { setWordCount(docRef.wordCount) })
    db.collection('users').doc(currentUser.uid).get().then((docRef) => { setEnglishType(docRef.englishType) })
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
  