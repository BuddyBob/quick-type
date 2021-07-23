import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { db } from '../../../firebase'
import NavBar from '../../Nav/NavBar';
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
    useEffect(() => {
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
    function returnIt(){
            let _ = require('underscore')
            const zipped = _.zip(wpmArr.slice(0,5),rawWpmArr.slice(0,5),accuracyArr.slice(0,5),realAccuracyArr.slice(0,5),errorArr.slice(0,5))
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
    function changeRows(){
        console.log(document.getElementById('row-count').value())
    }
    return(
        <div>
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
                    <div className="display">
                        <h3 className="text-center mt-5 mb-4 avgTitle" style={{color: '#ede8e8'}}>Display Log Settings</h3>
                        <form>
                            <div className="form-group row">
                                <label className="col-sm-2" style={{height:"50px",marginTop:"8px",marginLeft:"20px"}}>Rows</label>
                                <div className="col-sm-3 input-group">
                                    <input type="text" id="row-count" className="form-control inp" placeholder="type here"/>
                                    <button type="submit" onClick={changeRows} className="btn btn-dark btnThing" style={{backgroundColor:"#2D2F31",color:"#ffdc7a"}}>Update</button>
                                </div>
                            </div>
                        </form>
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
                                    {returnIt()}
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
