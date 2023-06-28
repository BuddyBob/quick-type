import './Settings.css'

import React, { useEffect, useState } from 'react'
import { doc, getDoc } from "firebase/firestore";

import NavBar from '../../Nav/NavBar';
import ToggleGroup from './SettingsButtons';
import { db } from '../../../firebase'

const Settings = (props) => {
    const [data, setData] = useState();
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const userId = localStorage.getItem('currentUserId');
          const docRef = doc(db, 'users', userId);
          const docSnap = await getDoc(docRef);
    
          if (docSnap.exists()) {
            setData(docSnap.data());
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.log('Error getting document:', error);
        }
      };
  
      fetchUserData();
    }, []);
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
  