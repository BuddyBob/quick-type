import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { db } from '../../../firebase'
import NavBar from '../../Nav/NavBar';
import Reload from '../../Reload'
import './Stats.css'
import 'bootstrap';
import $ from 'jquery';
import sum from 'lodash/sum';
const Stats = () => {
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
        localStorage.setItem("rowCount",e.target.value)
        Reload()
    }
    function clickMe(){
        $('.dropdown-toggle').dropdown()
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
                    <div className="text-center font-weight-bold mt-4 log-display">
                        <h3 className>Log Display Settings</h3>
                    </div>
        {/* <div class="dropdown">
            <button onClick={clickMe} className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Dropdown
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                <button className="dropdown-item" type="button">Action</button>
                <button className="dropdown-item" type="button">Another action</button>
                <button className="dropdown-item" type="button">Something else here</button>
            </div>
        </div> */}
                    <div className="dropdown">
                        <select name="rows-count" id="rows" defaultValue={rowCount} onChange={handleChange} >
                            <option value="5">5 rows</option>
                            <option value="10">10 rows</option>
                            <option value="30">30 rows</option>
                            <option value="60">60 rows</option>
                        </select>
                    </div>
                    <div>
                        <div>
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
