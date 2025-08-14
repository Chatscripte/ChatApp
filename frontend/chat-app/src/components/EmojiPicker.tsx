import React from 'react'
import EmojiPicker from 'emoji-picker-react';
import '../styles/EmojiPicker.scss'

interface EmojiPickerProps {
    setIsShowEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>
    setMessage: React.Dispatch<React.SetStateAction<string>>
}

function EmojiPickerComponent({ setIsShowEmojiPicker, setMessage }: EmojiPickerProps) {
    return (
        <div className='emoji-picker' onMouseLeave={() => setIsShowEmojiPicker(false)}>
            <EmojiPicker
                theme='dark'
                onEmojiClick={(emoji) => setMessage((prevMessage) => prevMessage + emoji.emoji)}
            />
        </div>
    )
}

export default EmojiPickerComponent
