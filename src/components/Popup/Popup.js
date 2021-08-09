import React from 'react'
import  useWindowDimensions  from './useWindowDimensions'
import assets from '../../assets/'
import { Paper, Grid } from '@material-ui/core/';
import { IoArrowForward } from 'react-icons/io5'
import { FaRedo } from 'react-icons/fa'
import { makeStyles } from '@material-ui/core/styles';
import './Popup.css'
const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      marginTop:80,
      position: 'relative',
      left:25
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: "#ffdc7a",
      backgroundColor: "#323437",
      elevation: 1,
    },
  }));
    // "start": "react-scripts start",
    // "build": "react-scripts build",
    // "test": "react-scripts test",
    // "eject": "react-scripts eject"
function chooseAnimal(wpm){
    let animal;
    let nextLevel = {Sloth:"Elephant",Elephant:"Horse",Horse:"Cheetah",Cheetah:"Hacker"}
    switch (true) {
        case wpm <= 30:
            animal = ["Sloth","Uhh... Your as slow as a sloth. Try again to be an "+nextLevel.Sloth]
            break
        case wpm >= 31 &&  wpm <= 50:
            animal = ["Elephant","You type as fast as an elephant. Try again to be a "+nextLevel.Elephant]
            break
        case (wpm > 50 && wpm <= 70):
            animal = ["Horse","You type as fast as a horse! Try again to be a "+nextLevel.Horse]
            break
        case (wpm > 70 && wpm <= 100):
            animal = ["Cheetah","Wow! You type as fast as a Cheetah can run! Try again to be a "+nextLevel.Cheetah]
            break
        case (wpm === "Infinity" || wpm > 200):
            animal = ["Hacker", "Legit! Totally Legit"]
        default:
            animal = ["Hacker","Oh... WOW! You type as fast as a HACKER! Wait, are you a hacker? "]
            break
    }
    return animal

}
function Popup(props) {
    const { width, height } = useWindowDimensions();
    const classes = useStyles();
    let x = false;
    let final_wpm = props.wpm(props.state.errors,props.state.symbols,props.state.sec)
    let final_raw_wpm = props.rawWpm(props.state.symbols,props.state.sec)
    let final_accuracy = props.accuracy(props.state.userInput,props.state.text.length)
    let final_real_accuracy = props.realAccuracy(props.state.userInput.length,props.state.text,props.state.errors)
    let seconds = props.state.sec % 60;
    let animal_text,animal_name,rest;
    [animal_name,animal_text] = chooseAnimal(final_wpm)
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
            <h3 className="popup-title">Results</h3>
            <FaRedo aria-label="restart button"className="class-btn restart" onClick={() => props.restart()} type="image"/>
            <IoArrowForward aria-label="next button"className="class-btn next" onClick={() => props.next()} type="image"/>
            <form className="form-inline">
                <div className={classes.root}>
                <Grid container spacing={2}>
                    <Grid item xs={5} sm={10} md={6}>
                        <Paper className={classes.paper}>Real Wpm</Paper>
                    </Grid>
                    <Grid item xs={5} sm={10} md={5}>
                        <Paper className={classes.paper}>{final_wpm}</Paper>
                    </Grid>
                    <Grid item xs={5} sm={10} md={6}>
                        <Paper className={classes.paper}>Raw Wpm</Paper>
                    </Grid>
                    <Grid item xs={5} sm={10} md={5}>
                        <Paper className={classes.paper}>{final_raw_wpm}</Paper>
                    </Grid>
                    <Grid item xs={5} sm={10} md={6}>
                        <Paper className={classes.paper}>{width > 599 ? "Real Accuracy" : "Real Acc"}</Paper>
                    </Grid>
                    <Grid item xs={5} sm={10} md={5}>
                        <Paper className={classes.paper}>{final_real_accuracy}</Paper>
                    </Grid>
                    <Grid item xs={5} sm={10} md={6}>
                        <Paper className={classes.paper}>{width > 599 ? "Raw Accuracy" : "Raw Acc"}</Paper>
                    </Grid>
                    <Grid item xs={5} sm={10} md={5}>
                        <Paper className={classes.paper}>{final_accuracy}</Paper>
                    </Grid>
                </Grid>
                </div>
                {height>=100 &&
                <form>
                    <div className="row level">
                        <div className="animal col">
                            <input 
                                className="animal-img" 
                                src={
                                animal_name === "Sloth" ? assets.images.Sloth : 
                                animal_name === "Cheetah" ? assets.images.Cheetah: 
                                animal_name === "Horse" ? assets.images.Horse: 
                                animal_name === "Hacker" ? assets.images.Hacker: 
                                animal_name === "Elephant" ? assets.images.Elephant:
                                " "
                                } 
                                type="image" 
                                />
                        </div>
                        <div className="col">
                            <span className="speed-desc">{animal_text}</span>
                        </div>
                    </div>
                    <div className="levels">
                        <h3 className="popup-sub-title">Levels</h3>
                        <div className="row">
                            <div className="row animal-levels">
                                {[assets.images.Sloth,assets.images.Elephant,assets.images.Horse,assets.images.Cheetah,assets.images.Hacker].map(n => {
                                    return(
                                        <input className="ind-animal" type="image" id="level-animals" name="animals" aria-label="animals" src={n}/>
                                    )
                            })}
                            </div>
                        </div>
                    </div>
                </form>
                }
            </form>
            {props.children}
            </div>

        </div>
    ) : "";
}
export default Popup
