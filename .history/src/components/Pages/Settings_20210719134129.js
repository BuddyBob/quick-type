
import ToggleGroup from '../SettingsButtons';
import NavBar from '../Nav/NavBar';
import React, { useState, useEffect } from 'react'
import { Label } from '../Label'
import { db } from '../../firebase'
import { useAuth } from '.././context/AuthContext'
import '../../index.css'

const Settings = (props) => {
    const { currentUser } = useAuth()
    const [wordCount,setWordCount] = useState()
    const [englishType,setEnglishType] = useState()
    const [data, setData] = useState()
    useEffect(() => {
        db.collection("users").doc(localStorage.getItem("currentUserId")).get().then((doc) => {
            if (doc.exists) {
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
        <>
        <NavBar/>
        <div className="settings">   
            <div>
                <h1 className="settings-title">Settings</h1>
            </div>
            <form className="form-inline">
                <div className="row row-display stats">
                    <div className="col-auto">
                        <Label type="label">Word Count</Label>
                        <ToggleGroup dbData={data} additionalText={" words"} runFunction={'changeWordCount'} change={"wordCount"}/>
                    </div>
                    <div className="col-auto">
                        <Label type="label">English Type</Label>
                        <ToggleGroup dbData={data} additionalText={""} runFunction={'changeEnglishType'} change={"englishType"}/>
                    </div>
                </div>
            </form>
        </div>
        </>
        );
}
export default Settings;
  