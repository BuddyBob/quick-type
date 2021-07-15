import { useAuth } from './context/AuthContext';
export default function CurrentUser() {
    const x = useAuth()
    return (
        <h1>{x}</h1>
    )
}
