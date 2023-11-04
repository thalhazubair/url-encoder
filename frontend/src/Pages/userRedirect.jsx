import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loading from 'react-loading-components';


export default function UserRedirect() {
  const [isLoading,setIsLoading]=useState(false)
    const {id}=useParams()
    useEffect(() => {
        (async function(){
          setIsLoading(true)
          console.log(isLoading)
            let {data} = await axios.get("user/geturl/"+id)
            setIsLoading(false)
            window.location.href=data.url.shortUrl
        })()
    }, [])
  return (
    <div>
      {
      isLoading?  <div className="d-flex justify-content-center align-items-center">
      <Loading type='ball_triangle'   width={100} height={100} fill='#f44242' />
      </div>:""
      }
    </div>
  )
}
