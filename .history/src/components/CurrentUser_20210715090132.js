import { useAuth } from './context/AuthContext';
const CurrentUser = () =>{
    const { currentUser } = useAuth()
}
