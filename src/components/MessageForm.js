import React, { useState } from 'react';
import Attachment from './svg/Attachment';
import './MessageForm.css';
import Send from './svg/Send';
import Picker from 'emoji-picker-react';

function MessageForm({ text, setText, handleSubmit, setImg }) {
    const [showEmojis, setShowEmojis] = useState(false);

    const onEmojiClick= (e, emojiObject) => {
        setText(prevInput => prevInput + emojiObject.emoji);
        setShowEmojis(false);
    }

    const handleShowEmojis = () => {
        setShowEmojis(!showEmojis);
    }
    
  return (
    <>
    {   showEmojis ? 
        <div className="emoji-picker-container">
            <Picker onEmojiClick={onEmojiClick} />
        </div> : null
    }
    <form className="message-form" onSubmit={handleSubmit}>
        <div className="msg-icons">
            <span className="material-icons" onClick={handleShowEmojis}>emoji_emotions_outlined</span>
            <label htmlFor="img">
                <span className="attachment"><Attachment /></span>
            </label>
            <input
                type="file"
                id="img"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => setImg(e.target.files[0])}
            />
        </div>
        <div>
            <input 
                type="text" 
                placeholder="Type a message" 
                value={text} 
                onChange={(e) => setText(e.target.value)} 
            />
        </div>
        <div>
            <button className="btn"><Send /></button>
        </div>
    </form>
    </>
  )
}

export default MessageForm