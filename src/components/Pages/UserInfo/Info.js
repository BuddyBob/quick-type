import NavBar from '../../Nav/NavBar' 
import './Info.css'
const Info = () => {
    return(
        <div>
            <NavBar/>
            <div className="info">
                <h1 className="info-title">Info</h1>
                <div className="info-container">
                    <p className="info-text">
                        Quick Type is a simple typing test which gives you many useful features 
                        to help you get accurate data about your typing stats and help you focus on
                        <strong> only</strong> typing fast!
                    </p>
                </div>
            </div>
        </div>
    )
}
export default Info