
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
                    <h2 className="register-title">Settings</h2>
                </div>
            {data &&
            <form className="settings-options">
                <div className="row mt-4">
                    <ToggleGroup dbData={data} change={"wordCount"} types={["50","60"]}/>
                <div className="row">
                    <ToggleGroup dbData={data} change={"englishType"} types={["english1k","english2k","english3k","english4k"]}/>
                </div>
                <div className="row">
                    <ToggleGroup dbData={data} change={"audio"} types={[false, true]}/>
                </div>
                </div>
            </form>
            }
            </div>
        </div>
        

        );
}
export default Settings;
  