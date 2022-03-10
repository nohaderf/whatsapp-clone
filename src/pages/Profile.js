import React, { useState, useEffect } from 'react';
import { storage, db, auth } from '../firebase';
import { 
    ref, 
    getDownloadURL, 
    uploadBytes, 
    deleteObject 
} from 'firebase/storage';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import './Profile.css';
import Img from '../blank-profile-picture.png';
import Camera from '../components/svg/Camera';
import Delete from '../components/svg/Delete';

function Profile() {
    const [img, setImg] = useState('');
    const [user, setUser] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
            if (docSnap.exists) {
              setUser(docSnap.data());
            }
          });

        if (img) {
            const uploadImg = async () => {
                const imgRef = ref(
                  storage,
                  `avatar/${new Date().getTime()} - ${img.name}`
                );
                try {
                    if (user.avatarPath) {
                        await deleteObject(ref(storage, user.avatarPath));
                    }
                    const snap = await uploadBytes(imgRef, img);
                    //console.log(snap.ref.fullPath) // gets image path
                    const url = await getDownloadURL(ref(storage, snap.ref.fullPath)) //gets image url
                    
                    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                        avatar: url,
                        avatarPath: snap.ref.fullPath //need this to use the image
                    });

                    setImg("");
                } catch (err) {
                    console.log(err.message);
                }
            };
            uploadImg();
        }
    }, [img, user.avatarPath])

    const deleteImage = async () => {
        try {
            const confirm = window.confirm('Delete avatar?')
            if (confirm) {
                await deleteObject(ref(storage, user.avatarPath));

                await updateDoc(doc(db, "users", auth.currentUser.uid), {
                    avatar: "",
                    avatarPath: "",
                })
                navigate('/')
            }
        } catch (err) {
            console.log(err.message);
        }
    }

  return user ? (
    <div className="profile-container">
        <div className="img-container">
            <img src={user.avatar || Img} alt="avatar" />
            <div className="overlay">
                <div>
                    <label htmlFor="photo">
                        <Camera /> 
                    </label>
                    { user.avatar ? <Delete deleteImage={deleteImage} /> : null }
                    <input 
                        className="camera-input" 
                        type="file" 
                        accept="image/*" 
                        id="photo" 
                        onChange={e => setImg(e.target.files[0])}
                    />
                </div>
            </div>
        </div>
        
        <div className="text-container">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <hr />
            <small>Joined on: {user.createdAt.toDate().toDateString()}</small>
         </div>
    </div>
  ) : null
}

export default Profile;