import { Label } from '../Label'
import ToggleGroup from '../SettingsButtons';
import NavBar from '../Nav/NavBar';

const Settings = (props) => {
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
                    <ToggleGroup additionalText={""} runFunction={"changeEnglishType"}localStorageName={"englishType"} types={['english','english1k','english2k']}/>
                </div>
                
            </div>
            );
}
export default Settings;
  