import { useAuth } from './context/AuthContext';
const CurrentUser = () =>{
    const { currentUser } = useAuth()
    return <div>{currentUser.email}</div>
}

export default CurrentUser;