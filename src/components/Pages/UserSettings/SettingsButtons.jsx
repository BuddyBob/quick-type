import './Settings.css';

import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import { Label } from '../../Label';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { db } from '../../../firebase';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 70,
    height: 26,
    padding: 0,
  },
  switchBase: {
    padding: 1,
    color: "#2D2F31",
    border: "white 1px solid",
    '&$checked': {
      transform: 'translateX(44px)',
      transitionDuration: ".1s",
      color: "#2D2F31",
      '& + $track': {
        backgroundColor: '#ede8e8',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '20px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

const SettingsButtons = ({ dbData, change, types }) => {
  const userId = localStorage.getItem('currentUserId');
  const [Alert, setAlert] = useState([false, "No Error"]);
  const [active, setActive] = useState();
  let [data, setData] = useState(dbData);
  const [state, setState] = React.useState({
    checkedB: false
  });

  useEffect(async () => {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    const docData = docSnap.data();

    await setActive(change === "englishType" ? docData.englishType : change === "audio" ? docData.audio : "");
    setState({ ...state, ["checkedB"]: docData.audio });
  }, []);

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

  const Btn = styled.button`
    border: none;
    background: #323437;
    color: #ffdc7a !important;
    font-weight: 200;
    padding: 18px;
    border-radius: 6px;
    display: inline-block;
    transition: all 0.3s ease 0s;
  `;

  const BtnToggle = styled(Btn)`
    opacity: 0.5;
    border-color: white;
    ${({ active }) =>
    active && `
      border:2px solid;
      border-color:#ffdc7a;
      opacity:5;
    `}
  `;

  async function handleChange(event, type) {
    setActive(type);

    if (change === "englishType") {
      await updateDoc(doc(db, 'users', userId), { englishType: type });
      localStorage.setItem("englishType", type);
    }

    if (change === "audio") {
      await setState({ ...state, [event.target.name]: event.target.checked });
      await updateDoc(doc(db, 'users', userId), { audio: !state.checkedB });
    }
  }

  function BtnGroup() {
    return (
      <div style={{ position: "relative", left: "30px", padding: "5px" }}>
        {types.map(type => (
          <BtnToggle style={{ margin: "5px" }} active={active === type} onClick={(e) => handleChange(e, type)}>{type}</BtnToggle>
        ))}
      </div>
    )
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
                    <IOSSwitch checked={state.checkedB} onChange={handleChange} name="checkedB"/>
                </div>
            </form>
        }
        </div>
    )
}
export default SettingsButtons;