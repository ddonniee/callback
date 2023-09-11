import React, { useState, useEffect } from "react";

export default function useFetch(props) {

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const {address, mtd, token} = props;
    
    useEffect( async ()=>{
        setLoading(true)
         await fetch(address,{
            mode:'cors',
            method: mtd,
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json',
                'Authorization': 'Bearer ' + token,
            }
        }) 
        .then (res=> {
            return res.json();
        })
        .then (resjson=>{
            setData(resjson)
        })
      .catch((err)=> {
          setError(err)
      })
      .finally(() => {
        setLoading(false);
      });
    },[address]);

    return {data, error, loading};
}

