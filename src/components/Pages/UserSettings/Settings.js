
import ToggleGroup from './SettingsButtons';
import NavBar from '../../Nav/NavBar';
import React, { useState, useEffect } from 'react'
import { db } from '../../../firebase'
import './Settings.css'

const Settings = (props) => {
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
        <div>
            <NavBar/>
            <div className="wrapper fadeInDown">
                <div id="formContent">
                    <div id="formContent"></div>
                    <h2 className="register-title">Settings</h2>
                </div>
            <form>
                <div className="row mt-4">
                    <div className="col">
                        <ToggleGroup dbData={data} change={"wordCount"}/>
                    </div>
                    <div className="col">
                        <ToggleGroup dbData={data} change={"englishType"}/>
                    </div>
                </div>
            </form>
            </div>
        </div>
        

        );
}
export default Settings;
  