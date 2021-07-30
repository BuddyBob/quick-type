const SetData = () => {
    console.log("CURRENT USER ID",localStorage.getItem("currentUserId"))
    //setData if user is not logged in
    if (localStorage.getItem("currentUserId") === null){
        if (localStorage.getItem("wordCount")) {
        console.log("WORD COUNT ",localStorage.getItem("wordCount"))
        }else{
            localStorage.setItem("wordCount","15")
        }
        if (localStorage.getItem("englishType")){
        console.log("ENGLISH TYPE",localStorage.getItem("englishType"))
        }else{
        localStorage.setItem("englishType","english1k")
        }
    } 
    if (localStorage.getItem("rowCount")){
        console.log("ROW COUNT",localStorage.getItem("rowCount"))
    }else{
        localStorage.setItem("rowCount","5")
    }
    if (localStorage.getItem("sortType")){
        console.log("SORT TYPE",localStorage.getItem("sortType"))
    }else{
        localStorage.setItem("sortType","new - old")
    }
}
export default SetData;