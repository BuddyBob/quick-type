import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { db } from '../../../firebase'
import NavBar from '../../Nav/NavBar';
import Reload from '../../Reload'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import './Stats.css'
import sum from 'lodash/sum';

const Stats = () => {
    const { currentUser } = useAuth();
    const [userId,setUserId] = useState(currentUser.uid)
    const [wpmArr,setWpmArr] = useState()
    const [rawWpmArr,setRawWpmArr] = useState()
    const [accuracyArr,setAccuracyArr] = useState()
    const [realAccuracyArr,setRealAccuracyArr] = useState()
    const [errorArr,setErrorArr] = useState()
    const [sortType,setSortType] = useState(localStorage.getItem("sortType"))
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
    function sortData(sortType,currentSort){
        const ind = {"old - new":-2, "new - old":-1, "Real Wpm":0,"Raw Wpm":1,"Raw Accuracy":2,"Real Accuracy":3,"Errors":4}
        const tp = ind[sortType]
        if (tp >= 0){
            currentSort.sort( function( a, b ){
            if ( a[tp] == b[tp] ) return 0;
            return a[tp] > b[tp] ? -1 : 1;
            });
            return currentSort
        }
        else if (tp === -2){
            //flip order
            return currentSort.reverse()
        }
        else if (tp === -1){
            return currentSort
        }

    }
    function returnIt(rowDisplay){
            let _ = require('underscore')
            const zipped = _.zip(wpmArr.slice(0,rowDisplay),rawWpmArr.slice(0,rowDisplay),accuracyArr.slice(0,rowDisplay),realAccuracyArr.slice(0,rowDisplay),errorArr.slice(0,rowDisplay))
            //sort zip
            const modZipped = sortData(sortType,zipped)
            return modZipped.map(pair => {
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
    function handleChange(e,change){
        if (change === "rows"){setRowCount(e.target.value);localStorage.setItem("rowCount",e.target.value);}
        else if (change === "sort"){setSortType(e.target.value);localStorage.setItem("sortType",e.target.value);}
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
                    <div className="log">
                        <div id="log-settings">
                            <form className="input-group">
                                <div className="row-count-drop">
                                    <FormControl variant="filled" className="row-count-dropdown">
                                        <InputLabel className="dropdown-label" style={{color:"#ffdc7a", backgroundColor:"#323437"}}>Rows</InputLabel>
                                        <Select style={{color:"white"}} value={rowCount} onChange={(e) => handleChange(e,"rows")}>
                                        <MenuItem value={5}><span className="options">5 rows</span></MenuItem>
                                        <MenuItem value={10}><span className="options">10 rows</span></MenuItem>
                                        <MenuItem value={30}><span className="options">30 rows</span></MenuItem>
                                        <MenuItem value={100}><span className="options">100 rows</span></MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="log-sort-drop">
                                    <FormControl variant="filled" className="sort-type-dropdown">
                                        <InputLabel className="dropdown-label" style={{color:"#ffdc7a", backgroundColor:"#323437"}}>Sort</InputLabel>
                                        <Select style={{color:"white"}} value={sortType} onChange={(e) => handleChange(e,"sort")}>
                                        <MenuItem value={"new - old"}><span className="options">Newest to Oldest</span></MenuItem>
                                        <MenuItem value={"old - new"}><span className="options">Oldest to Newest</span></MenuItem>
                                        <MenuItem value={"Real Wpm"}><span className="options">Real Wpm</span></MenuItem>
                                        <MenuItem value={"Raw Wpm"}><span className="options">Raw Wpm</span></MenuItem>
                                        <MenuItem value={"Real Accuracy"}><span className="options">Real Accuracy</span></MenuItem>
                                        <MenuItem value={"Raw Accuracy"}><span className="options">Raw Accuracy</span></MenuItem>
                                        <MenuItem value={"Errors"}><span className="options">Errors</span></MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </form>
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
                </div>
            }
        </div>
    )
}
export default Stats
