import CommentIcon from "./icon/CommentIcon";
import LikeIcon from "./icon/LikeIcon";
import { useEffect, useState } from 'react'
import Comment from './Comment'

const Post = ({ avatarUrl, lastname, firstname, postId, content, imageUrl, user, postUser, groupomania, reloadPage }) => {

    const [commentsList, setCommentsList] = useState(null)
    const [postComment, setPostComment] = useState('')
    const [reload, setReload] = useState(true)

    useEffect(() => {
        if (reload) {
            groupomania.api.get(`/comment/${postId}`)
                .then(result => {
                    setCommentsList(result.data.comments)
                    setReload(false)
                })
        }
    }, [reload])

    const createComments = () => {
        if (commentsList !== null) {
            return commentsList.map(comment => {
                return <Comment key={comment.id} groupomania={groupomania} commentId={comment.id} reloadPost={setReload} user={user} userId={comment.user_id}  avatarUrl={comment.avatar_url} content={comment.content} lastname={comment.lastname} firstname={comment.firstname}/>
            })
        }
    }

    const handlePostComment = (e) => {
        e.preventDefault()
        groupomania.api.post(`/comment/${postId}`, {comment: postComment})
            .then(result => {
                if(result.status === 201) {
                    setReload(true)
                    setPostComment('')
                }
            })
            .catch(error => console.log({error}))
    }

    const handleDeletePost = (e) => {
        e.preventDefault()
        groupomania.api.delete(`/post/${postId}`)
            .then(result => {
                reloadPage(true)
            })
    }

    return (
        <div className={'post'}>
            <div className={'post__avatar'}><img alt={'avatar de l\'utilisateur qui a créé le post'} src={avatarUrl} /></div>
            <div className={'post__content'}>
                <div className={'post__content__title'}>
                    <p>{firstname} {lastname}</p>
                    {postUser === user.id || user.role >= 2 ? <i onClick={handleDeletePost} className="fas fa-trash-alt"></i> : ''}
                </div>
                <p>{ content }</p>
                {imageUrl ? <img alt={'relation avec le post'} src={imageUrl} /> : ''}
                <div className={'divider'} />
                <div className={'post__footer'}>
                    <div><CommentIcon /><span> {(commentsList !== null && commentsList.length !== 0) ? commentsList.length : 0}</span></div>
                    <div><LikeIcon /><span> 0</span></div>
                </div>
                <div className='comments'>
                    <form onSubmit={handlePostComment} className={'form__comment'} method={'POST'} >
                        <textarea onChange={(e) => setPostComment(e.target.value)} required id={'comment'} name={'comment'} value={postComment}></textarea>
                        <button type={'submit'}>Commenter</button>
                    </form>
                    {createComments()}
                </div>
            </div>
        </div>
    )
}

export default Post