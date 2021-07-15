import { useAuth } from './context/AuthContext';
const CurrentUser = () =>{
    const { currentUser } = useAuth()
    return <div>EMAIL{currentUser.email}</div>
}

export default CurrentUser;