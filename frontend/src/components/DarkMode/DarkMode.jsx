import './DarkMode.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faLightbulb} from "@fortawesome/free-solid-svg-icons"


const DarkMode = () => {
  
  const DarkHandle = () => {
    document.querySelector('body').classList.toggle('darkmode');
    const isDarkMode = document.body.classList.contains('darkmode');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
  }

    return ( 
        <div className="dark-mode-icon">
            <FontAwesomeIcon icon={faLightbulb} onClick={DarkHandle}/>
        </div>
     );
}
 
export default DarkMode;