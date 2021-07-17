
import ToggleGroup from '../SettingsButtons';
import NavBar from '../Nav/NavBar';
import React, { useState, useEffect } from 'react'
import { Label } from '../Label'
import { db } from '../../firebase'
import { useAuth } from '.././context/AuthContext'

const Settings = (props) => {
    const { currentUser } = useAuth()
    const [dbData,setDbData] = useState('')
    db.collection('users').doc(currentUser.uid).get().then((docRef) => { setDbData(docRef.wordCount) })
    return (
        <div>   
            <NavBar/>
            <div>
                <h1 className="settings-title">Settings</h1>
            </div>
            <div className="wordCount-container">
                <Label type="label">Word Count</Label>
                <ToggleGroup additionalText={" words"} runFunction={'changeWordCount'} change={"wordCount"} types={['10','15','60']}/>
            </div>
            <div className="wordCount-container">
                <Label type="label">English Type</Label>
                <ToggleGroup additionalText={""} runFunction={"changeEnglishType"} change={"englishType"} types={['english','english1k','english2k']}/>
            </div>
            
        </div>
        );
}
export default Settings;
  