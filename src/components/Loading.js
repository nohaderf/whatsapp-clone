import React from 'react'
import './Loading.css';
import Lock from './svg/Lock';

function Loading() {
  return (
    <div className="loading-containter">
        <div className="loading-details">
          <img
            className="whatsapp_logo"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/598px-WhatsApp.svg.png"
            alt=""
          />
          <h2>Whatsapp</h2>
          <span><Lock /> End-to-end encrypted</span>
        </div>
    </div>
  )
}

export default Loading;