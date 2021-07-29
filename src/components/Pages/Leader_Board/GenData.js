import { useState } from 'react'
import { useEffect } from 'react'
import { db } from '../../../firebase'
const GenData = () => {
    const [data, setData] = useState()
    useEffect(async () => {
        const snapshot = await db.collection('users').get()
        setData(snapshot.docs.map(doc => doc.data()))
    }, [])
    console.log(data)
    return {data}
}
export default GenData;

