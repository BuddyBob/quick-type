import React from 'react'
import './Popup.css'
import { CgClose } from 'react-icons/cg'
import { FaRedo } from 'react-icons/fa'

function Popup(props) {
    let final_wpm = props.wpm(props.state.errors,props.state.symbols,props.state.sec)
    let final_raw_wpm = props.rawWpm(props.state.symbols,props.state.sec)
    let final_accuracy = props.accuracy(props.state.userInput,props.state.text.length)
    let final_real_accuracy = props.realAccuracy(props.state.userInput.length,props.state.text,props.state.errors)
    let seconds = props.state.sec % 60;
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
            <div className="input-group">
            <FaRedo aria-label="restart button"className="class-btn restart" onClick={() => props.restart()} type="image"/>
            <CgClose aria-label="close button"className="class-btn close" onClick={() => props.close()} type="image"/>
            </div>
            <form className="form-inline">
                <div className="row row-display stats">
                    <div className="col-auto">
                        <div className="col-auto">
                            <span className="label-popup">Real Wpm </span>
                        </div>
                        <div className="col-auto">
                            <h2 className="number">{final_wpm}</h2>
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="col-auto">
                            <span className="label-popup">Raw Wpm </span>
                        </div>
                        <div className="col-auto">
                            <h2 className="number">{final_raw_wpm}</h2>
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="col-auto">
                            <span className="label-popup">Real Accuracy </span>
                        </div>
                        <div className="col-auto" >
                            <h2 className="number">{final_real_accuracy}%</h2>
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="col-auto">
                            <span className="label-popup">Raw Accuracy </span>
                        </div>
                        <div className="col-auto" >
                            <h2 className="number">{final_accuracy}%</h2>
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="col-auto">
                            <span className="label-popup">Time </span>
                        </div>
                        <div className="col-auto" >
                            <h2 className="number">{seconds}s</h2>
                        </div>
                    </div>
                </div>
            </form>
            {props.children}
            </div>
        </div>
    ) : "";
}
export default Popup
