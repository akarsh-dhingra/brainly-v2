import {useState,useEffect} from "react";

export default function UseFetch(url:string){
    const [finalData,setfinalData]=useState({});
    console.log(finalData);

    async function getDetails(){
        const fetchData=await fetch(url);
        const jsonData=await fetchData.json();
        setfinalData(jsonData);
    }
    useEffect(() => {
    getDetails();
    }, [url])
}