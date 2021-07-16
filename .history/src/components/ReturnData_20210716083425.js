import { db } from '../firebase'
import React, { useState , useEffect} from 'react';
function ReturnData(userId){
        function returnUserData(userId){
            let docRef = db.collection("users").doc(userId)
            return docRef.get().then((doc) => {
                if (doc.exists) {
                    console.log("DATA"+doc.data())
                    return doc.data();
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }
        const [data, setDta] = useState();
        useEffect(() => {
            returnUserData(userId).then(result => {
            setDta(result)
            })
        }, [])
        return data
}
export default ReturnData;