import React, { createRef } from 'react'
import ImportImage from "./ImportImage";



const PostForm = ({profileImage, postValue, handleSubmitPost, file, handleFileChange, handlePostChange, formRef}) => {
    const textAreaRef = createRef()

    const handleFixSize = () => {
        textAreaRef.current.style.height = '0px'
        const height = textAreaRef.current.scrollHeight
        textAreaRef.current.style.height = height + 'px'
    }
  return (
      <div className='form-post'>
          <div className='profile-image'>
              <img alt={'Avatar'} src={profileImage} />
          </div>
          <form ref={formRef} onSubmit={handleSubmitPost}>
              <textarea ref={textAreaRef} onInput={handleFixSize} onChange={(e) => handlePostChange(e.target.value)} value={postValue} placeholder={'Ecrivez quelque chose'} />
              <div className={'form-footer'}>
                  <ImportImage file={file} handleFileChange={handleFileChange} color='blue' />
                  <button type={"submit"}>Envoyer</button>
              </div>
          </form>
      </div>
  )
}

export default PostForm