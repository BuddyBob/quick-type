import { useAuth } from './context/AuthContext';
export default function CurrentUser() {
    const { currentUser } = useAuth()
    return (
        <h1>{x}</h1>
    )
}
