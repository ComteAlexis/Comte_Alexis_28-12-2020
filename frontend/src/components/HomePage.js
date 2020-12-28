import React, { useState, useEffect } from "react"
import Header from './Header'
import PostForm from "./PostForm";
import Post from './Post'

const HomePage = function ({ groupomania, user }) {

    const [inputFile, setFile] = useState(null)
    const [post, setPost] = useState('')
    const [postList, setPostList] = useState(null)
    const [reload, setReload] = useState(true)
    const [avatarUrl, setAvatarUrl] = useState('')

    useEffect(() => {
        if (reload) {
            groupomania.api.get('/post')
                .then(result => {
                    setPostList(result.data['posts'])
                    setReload(false)
                })
        }
    }, [reload])

    useEffect(() => {
        groupomania.api.get('user/myinfo')
            .then(result => {
                setAvatarUrl(`http://localhost:5500/api/images/avatar/${result.data.userInfo[0].avatar_url}`)
            })
    }, [])

    useEffect(() => {
        document.title= 'Article'
    }, [])

    const createPostsList = () => {
        if (postList !== null) {
            return Object.keys(postList).map( key => (
                <Post key={postList[key].postId} lastname={postList[key].lastname}
                      user={user}
                      postId={postList[key].postId}
                      postUser={postList[key].id}
                      imageUrl={postList[key].image_url ? `http://localhost:5500/api/images/post/${postList[key].image_url}` : null}
                      firstname={postList[key].firstname} content={postList[key].content}
                      avatarUrl={`http://localhost:5500/api/images/avatar/${postList[key].avatar_url}`}
                      groupomania={groupomania}
                      reloadPage={setReload}/>
            ))

        }
    }

    const handleSubmitPost = (e) => {
        e.preventDefault()
        const file = new FormData()
        if( inputFile !== null ) {
            file.append('image', inputFile, inputFile.name)
        }
        file.append('post', post)
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryjmjNouh8CPOqGLDX'
            }
        }
        groupomania.api.post('/post', file, config)
            .then(res => {
                if (res.status === 201) {
                    setPost('')
                    setFile(null)
                    setReload(true)
                }
            })
    }



    return (
        <>
            <Header />
            <div className={'wrapper'}>
                <PostForm postValue={post} handleSubmitPost={handleSubmitPost} handlePostChange={setPost} file={inputFile} handleFileChange={setFile} profileImage={avatarUrl} />
                {createPostsList()}
            </div>
        </>
    )
}

export default HomePage