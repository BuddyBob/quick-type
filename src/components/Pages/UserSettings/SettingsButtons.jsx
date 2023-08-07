import './Settings.css';

import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

import Button from '@mui/material/Button';
import { Label } from '../../Label';
import Switch from '@mui/material/Switch';
import { css } from '@emotion/react';
import { db } from '../../../firebase';
import { styled } from '@mui/system';

const SettingsButtons = ({ dbData, change, types }) => {
  const userId = localStorage.getItem('currentUserId');
  const [Alert, setAlert] = useState([false, "No Error"]);
  const [active, setActive] = useState();
  let [data, setData] = useState(dbData);
  const [state, setState] = useState({ checkedB: false });

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      const docData = docSnap.data();
  
      setActive(change === "englishType" ? docData.englishType : change === "audio" ? docData.audio : "");
      setState((prevState) => ({ ...prevState, checkedB: docData.audio }));
    };
  
    fetchData();
  }, [change, userId]);

  // wordCount is updated "on change"
  
  async function changed(e) {
    const val = e.target.value;

    if (change === "wordCount") {
      function isNumeric(num) { return !isNaN(num) }
      const isNum = isNumeric(val)

      switch (true) {
        case isNum === false:
          setAlert([true, "You have not entered a valid number"]);
          break;
        case val < 5:
          setAlert([true, "You have entered a number less than 5"]);
          break;
        default:
          setAlert([false, "No Error"]);
          await updateDoc(doc(db, 'users', userId), { wordCount: val });
          break;
      }
    }

    // for inputs only
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    setData(docSnap.data());
    localStorage.setItem("wordCount", val);
    dbData = data;
  }
  async function handleChange(event, type) {
    setActive(type);

    if (change === "englishType") {
      await updateDoc(doc(db, 'users', userId), { englishType: type });
      localStorage.setItem("englishType", type);
    }

    if (change === "audio") {
      setState((prevState) => ({ ...prevState, checkedB: !prevState.checkedB }));
      await updateDoc(doc(db, 'users', userId), { audio: !state.checkedB });
    }
  }

  function BtnGroup() {
    return (
      <div style={{ position: "relative", padding: "5px" }}>
        {types.map(type => (
          <input
            key={type}
            style={{ margin: "5px" }}
            className={`button ${active === type ? "active" : ""}`}
            type="button"
            onClick={(e) => handleChange(e, type)}
            value={type}
          />
        ))}
      </div>
    );
  }
  

    
    return (
        <div>
            { Alert[0] &&
            <div className="container">
                <div className="row" id="danger-container">
                    <div className="span20">
                        <div className="alert alert-danger alert-dismissible" role="alert">
                            <h5 className="alert-heading">OOPS</h5>
                            <span style={{fontSize:"15px"}}>{Alert[1]}</span>
                            <button onClick={() => {setAlert([false,null])}} type="button" className="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">x</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            }
        {change === "englishType" &&
            <form>
                <div className="row">
                    <div className="col mt-3 englishType-label" style={{left:"20px"}}>
                        <Label type="label" >{change}</Label>
                    </div>
                </div>
                <div className="row btnGroup">
                    {BtnGroup()}
                </div>
            </form>
        }
        {change === "wordCount" &&
            <form>
                <div className="row">
                    <div className="col mt-3 wordCount-label">
                        <Label type="label" >{change}</Label>
                    </div>
                </div>
                    <input className="wordCount-input" onChange={changed} placeholder={dbData ? dbData.wordCount : null} type="text" />
            </form>
        }
        {change === "audio" &&
            <form>
                <div className="row">
                    <div className="col mt-3 audio-label">
                        <Label type="label">{change}</Label>
                    </div>
                </div>
                <div className="row audio-toggle">
                    {/* <Switch checked={state.checkedB} onChange={() => handleChange()} name="checkedB"/> */}
                </div>
            </form>
        }
        </div>
    )
}
export default SettingsButtons;