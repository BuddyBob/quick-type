import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { db } from '../../../firebase'
import NavBar from '../../Nav/NavBar';
import Reload from '../../Reload'
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import './Stats.css'
import sum from 'lodash/sum';
const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1.4),
      minWidth: 110
    },
  }));
const Stats = () => {
    const classes = useStyles();
    const { currentUser } = useAuth();
    const [userId,setUserId] = useState(currentUser.uid)
    const [wpmArr,setWpmArr] = useState()
    const [rawWpmArr,setRawWpmArr] = useState()
    const [accuracyArr,setAccuracyArr] = useState()
    const [realAccuracyArr,setRealAccuracyArr] = useState()
    const [errorArr,setErrorArr] = useState()
    const [rowCount,setRowCount] = useState(localStorage.getItem("rowCount"))
    useEffect(async () => {
            db.collection("users")
            .doc(userId)
            .get()
            .then(
                async (doc) => {
                    const data = await doc.data()
                    await setWpmArr(data.logs.wpmHistory.reverse())
                    await setRawWpmArr(data.logs.rawWpmHistory.reverse())
                    await setAccuracyArr(data.logs.accuracyHistory.reverse())
                    await setRealAccuracyArr(data.logs.realAccuracyHistory.reverse())
                    await setErrorArr(data.logs.errorHistory.reverse())
                }
            )
        },[]
    )
    function getAvg(arr){
        return (sum(arr)/arr.length)
    }
    function returnIt(rowDisplay){
            let _ = require('underscore')
            const zipped = _.zip(wpmArr.slice(0,rowDisplay),rawWpmArr.slice(0,rowDisplay),accuracyArr.slice(0,rowDisplay),realAccuracyArr.slice(0,rowDisplay),errorArr.slice(0,rowDisplay))
            return zipped.map(pair => {
                return (
                    <tr>
                        <td>
                            {pair[0]}
                        </td>
                        <td>
                            {pair[1]}
                        </td>
                        <td>
                            {pair[2]}
                        </td>
                        <td>
                            {pair[3]}
                        </td>
                        <td>
                            {pair[4]}
                        </td>
                    </tr>
                )
        })
    }
    function handleChange(e){
        setRowCount(e.target.value)
        localStorage.setItem("rowCount",e.target.value)
    }
    return(
        <div className="iii">
            {wpmArr && rawWpmArr && accuracyArr && realAccuracyArr && errorArr &&
                <div>
                    <NavBar/>
                    <div>
                        <h2 className="text-center font-weight-bold mt-4 avgTitle ">Averages</h2>
                        <table className="table table-dark table-striped tb">
                            <thead >
                                <tr className="table-light">
                                    <th scope="col">Wpm</th>
                                    <th scope="col">Raw Wpm</th>
                                    <th scope="col">Accuracy</th>
                                    <th scope="col">Real Accuracy</th>
                                    <th scope="col">Errors</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{Math.round((getAvg(wpmArr) + Number.EPSILON) * 100) / 100 }</td>
                                    <td>{Math.round((getAvg(rawWpmArr) + Number.EPSILON) * 100) / 100 }</td>
                                    <td>{Math.round((getAvg(accuracyArr) + Number.EPSILON) * 100) / 100 }</td>
                                    <td>{Math.round((getAvg(realAccuracyArr) + Number.EPSILON) * 100) / 100 }</td>
                                    <td>{Math.round((getAvg(errorArr) + Number.EPSILON) * 100) / 100 }</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div id="log-settings">
                        <div className="row-count-drop">
                            <FormControl variant="filled" className={classes.formControl}>
                                <InputLabel className="dropdown-label" style={{color:"#ffdc7a", backgroundColor:"#323437"}}>Rows</InputLabel>
                                <Select style={{color:"white"}} value={rowCount} onChange={handleChange}>
                                <MenuItem value={5}>5 rows</MenuItem>
                                <MenuItem value={10}>10 rows</MenuItem>
                                <MenuItem value={30}>30 rows</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div id="log-table">
                        <h2 className="text-center font-weight-bold mt-5 avgTitle">Log</h2>
                        <table className="table table-dark table-striped tb">
                            <thead >
                                <tr className="table-light">
                                    <th scope="col">Wpm</th>
                                    <th scope="col">Raw Wpm</th>
                                    <th scope="col">Accuracy</th>
                                    <th scope="col">Real Accuracy</th>
                                    <th scope="col">Errors</th>
                                </tr>
                            </thead>
                            <tbody>
                                {returnIt(rowCount)}
                            </tbody>
                        </table>
                    </div>
                </div>
            }
        </div>
    )
}
export default Stats
