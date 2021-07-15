import { useAuth } from './context/AuthContext';
const CurrentUser = () =>{
    const { currentUser } = useAuth()
    return <div>EMAIL</div>
}

export default CurrentUser;