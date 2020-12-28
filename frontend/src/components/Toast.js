import React from 'react'

const Toast = ({ title, message, onDelete }) => {
    return (<div className='toast'>
        <div className='toast-title'>
            <p>{title}</p>
            <button onClick={onDelete}>X</button>
        </div>
        <div className='toast-text'>
            <p>{message}</p>
        </div>
    </div>)
}

export default Toast