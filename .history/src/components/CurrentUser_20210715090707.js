import { useAuth } from './context/AuthContext';
export default function CurrentUser() {
    const { currentUser } = useAuth()
    return currentUser.email
}
