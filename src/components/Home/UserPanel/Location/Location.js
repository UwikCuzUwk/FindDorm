import React, {useEffect}from 'react'

function Location() {
useEffect(()=>{
navigator.geolocation.getCurrentPosition((position)=>{
  console.log(position)
})
},[])

  return (
    <div>Location</div>
  )
}

export default Location