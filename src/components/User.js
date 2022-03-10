import React, { useEffect, useState } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase';

import Img from '../blank-profile-picture.png';
import './User.css';

function User({ user, selectUser, user1, chat }) {
  const [data, setData] = useState("");
  const user2 = user?.uid
  
  useEffect(() => {
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    let unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
      setData(doc.data());
    });

    return () => unsub();
  }, [user1,user2]);


  return (
    <>
      <div 
        className={`user-wrapper ${chat.name === user.name && "selected-user"}`} 
        onClick={() => selectUser(user)}
      >
        <div className="user-info">
          <div className="user-detail">
            <img src={user.avatar || Img} alt="avatar" className="avatar" />
            <div>
              <div className="chat-details">
              <h4>{user.name}</h4>
              {data?.from !== user1 && data?.unread && (
              <small className="unread">New</small>
              )}
              </div>
              { data && (
                <p className="truncate">
                  <strong>{data.from === user1 ? "Me: " : null }</strong>
                  {data.text}
                  {/* <small>{data.createdAt}</small> */}
                </p>
              )}
            </div>
          </div>
          <div 
            className={`user-status ${user.isOnline ? "online" : "offline"}`}
          ></div>
      </div>
    </div>
    <div
      onClick={() => selectUser(user)}
      className={`sm-container ${chat.name === user.name && "selected-user"}`} 
    >
      <img src={user.avatar || Img} alt="avatar" className="avatar sm-screen" />
    </div>
    </>
  )
}

export default User