import React from 'react'
import  useWindowDimensions  from './useWindowDimensions'
import Cheetah from '../../images/Cheetah.png'
import Sloth from '../../images/Sloth.png'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
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
function chooseAnimal(wpm){
    let animal;
    switch (true) {
        case wpm < 30:
            animal = ["Sloth","You're as fast as a Sloth."]
            break
        case (wpm > 91):
            animal = ["Cheetah","Wow! You're as fast as a Cheetah."]
            break
        default:
            animal = ["Hacker","You type as fast as a HACKER!"]
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
                                animal_name === "Sloth" ? Sloth : 
                                animal_name === "Cheetah" ? Cheetah: 
                                Cheetah
                                } 
                                type="image" 
                                />
                        </div>
                        <div className="col">
                            <span className="speed-desc">{animal_text}</span>
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
