import React from 'react'
import { Riple } from 'react-loading-indicators'

const Lading = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // full screen height
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <Riple color="#cc3131" size="medium" text="LOADING" textColor="#cc3131" />
    </div>
  )
}

export default Lading
