import { useAuth } from './context/AuthContext';
export default function CurrentUser() {
    const { currentUser } = useAuth()
    return (
        <h1>{currentUser.email}</h1>
    )
}
