import React, { useState, useEffect } from 'react';
import { db, auth, storage } from '../firebase';
import { Link } from 'react-router-dom';
import { useStateValue } from "../StateProvider";
import { actionTypes } from '../reducer';

import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  setDoc,
  doc,
  getDoc,
  updateDoc
} from 'firebase/firestore';
import { 
  ref, 
  getDownloadURL, 
  uploadBytes, 
} from 'firebase/storage';
import './Home.css';
import User from '../components/User'
import MessageForm from '../components/MessageForm';
import Message from '../components/Message';
import Img from '../blank-profile-picture.png';


function Home() {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState("")
  const [msgs, setMsgs] = useState([]);
  const [{ avatar }, dispatch] = useStateValue();

  const user1 = auth.currentUser.uid;

  useEffect(() => {
    const usersRef = collection(db, 'users')
    //create query object
    const q = query(usersRef, where('uid', 'not-in', [user1]))
    //execute the query
    const unsub = onSnapshot(q, querySnapshot => {
      let users = [];
      querySnapshot.forEach(doc => {
        users.push(doc.data())  
      })
      setUsers(users)
    })
    return () => unsub();
  }, [user1])

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", user1), (doc) => {
      dispatch({
        type: actionTypes.SET_AVATAR,
        avatar: doc.data().avatar
      })
  });
      return () => unsubscribe();
  }, [avatar, dispatch, user1])

  const selectUser = async (user) => {
    setChat(user);

    const user2 = user.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    const msgsRef = collection(db, 'messages', id, 'chat');
    const q = query(msgsRef, orderBy('createdAt', 'asc'))

    onSnapshot(q, querySnapshot => {
      let msgs = [];
      querySnapshot.forEach(doc => {
        msgs.push(doc.data())
      });
      setMsgs(msgs);
    });

    // get last message b/w logged in user and selected user
    const docSnap = await getDoc(doc(db, "lastMsg", id));
    // if last message exists and message is from selected user
    if (docSnap.data() && docSnap.data().from !== user1) {
      // update last message doc, set unread to false
      await updateDoc(doc(db, "lastMsg", id), { unread: false });
    }
  }

  const handleSubmit = async e => {
    e.preventDefault();
    const user2 = chat.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`

    let url;
    if (img) {
      const imgRef = ref(
        storage,
        `images/${new Date().getTime()} - ${img.name}`
      );
      const snap = await uploadBytes(imgRef, img);
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url = dlUrl;
    }

    await addDoc(collection(db, 'messages', id, 'chat'), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
    });

    await setDoc(doc(db, "lastMsg", id), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
      unread: true,
    })
    setText("")
  }

  return (
    <div className="home-container">
      <div className="users-container">
        <div className="sidebar">
          <div className="sidebar-header">
              <span>
                  <img className="curr-avatar" src={ avatar || Img } alt="avatar"/>    
              </span>
              <div className="sidebar-headerRight">
                  <Link to="/profile">
                    <span className="material-icons" title="Profile">donut_large</span>
                  </Link>
                  <a href="/">
                    <span className="material-icons" title="New Chat">chat</span>
                  </a>
                  <a href="/">
                    <span className="material-icons" title="More...">more_vert</span>
                  </a>
              </div>
            </div>
        </div>
        {/* <div className="sidebar-search">
            <div className="sidebar-searchContainer">
                <span className="material-icons">search</span>
                <input placeholder="Search in chat" type="text" />
            </div>
        </div> */}
          {users.map(user => {
            return <User 
              key={user.uid} 
              user={user} 
              selectUser={selectUser} 
              user1={user1}
              chat={chat}
            />
          })}
        </div>
        <div className="messages-container">
          { chat ? (
            <>
              <div className="messages-user">
                <img className="avatar-chat" src={chat.avatar || Img} alt="avatar"/>
                <h3>{chat.name}</h3>
              </div>
              <div className="chat">
                <div className="messages">
                  { msgs.length 
                      ? msgs.map((msg, i) => <Message key={i} msg={msg} user1={user1} /> )
                      : null }
                </div>
              </div>
              <div className="message-form-container">
                <MessageForm 
                  handleSubmit={handleSubmit} 
                  text={text} 
                  setText={setText} 
                  setImg={setImg}
                />
              </div>
            </>
          ) : (
            <h3 className="no-chat">Select a user to start conversation</h3>
          )}
        </div>
    </div>
  )
}

export default Home;