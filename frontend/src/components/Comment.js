import groupomania from "../js/Groupomania";

const Comment = ({ avatarUrl, commentId, reloadPost, firstname, user, userId, lastname, content, groupomania }) => {
    const handleDeleteComment = (e) => {
        e.preventDefault()
        groupomania.api.delete(`/comment/${commentId}`)
            .then(result => {
                reloadPost(true)
            })
    }
    return (
        <div className={'comment'}>
            <div className={'comment__avatar'}><img alt={'avatar de l\'utilisateur qui a créé le post'} src={`http://localhost:5500/api/images/avatar/${avatarUrl}`} /></div>
            <div className={'comment__content'}>
                <div className={'comment__content__title'}>
                    <p>{firstname} {lastname}</p>
                    {userId === user.id || user.role >= 2 ? <i onClick={handleDeleteComment} className="fas fa-trash-alt"></i> : ''}
                </div>
                <p>{ content }</p>
            </div>
        </div>
    )
}

export default Comment