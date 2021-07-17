import { Label } from '../Label'
import ToggleGroup from '../SettingsButtons';
import NavBar from '../Nav/NavBar';
import { db } from '../firestore'

const Settings = (props) => {
    const [dbData,setDbData] = useState('')
    db.collection('users').doc(currentUser.uid).get().then((docRef) => { setWordCount(docRef.wordCount) })
    return (
        <div>   
            <NavBar/>
            <div>
                <h1 className="settings-title">Settings</h1>
            </div>
            <div className="wordCount-container">
                <Label type="label">Word Count</Label>
                <ToggleGroup additionalText={" words"} runFunction={'changeWordCount'} change={"wordCount"} types={['10','15','60']}/>
            </div>
            <div className="wordCount-container">
                <Label type="label">English Type</Label>
                <ToggleGroup additionalText={""} runFunction={"changeEnglishType"} change={"englishType"} types={['english','english1k','english2k']}/>
            </div>
            
        </div>
        );
}
export default Settings;
  