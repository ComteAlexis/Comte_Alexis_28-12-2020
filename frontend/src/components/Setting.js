import React, { useEffect, useState } from 'react'

const Setting = ({groupomania, user, disconnected}) => {

    const [userInfo, setUserInfo] = useState({
        lastname: '',
        firstname: '',
        email: '',
        avatar_url: ''
    })

    const [userPass, setUserPass] = useState({
        oldPass: '',
        newPass: '',
        newPassVerif:''
    })

    const [avatar, setAvatar] = useState(null)

    const [reload, setReload] = useState(true)

    const avatarRef = React.createRef()
    const imageRef = React.createRef()

    useEffect(() => {
        if(reload) {
            groupomania.api.get('/user/myinfo')
                .then(info => {
                    const user = info.data.userInfo[0]
                    user.avatar_url = `http://localhost:5500/api/images/avatar/${info.data.userInfo[0].avatar_url}`
                    setUserInfo(user)
                })
                .catch(error => console.log(error))
            setReload(false)
        }
    }, [reload])

    const setInfo = (e, key) => {
        const info = {...userInfo}
        info[key] = e.target.value
        setUserInfo({...info})
    }

    const changePass = (e, key) => {
        const passInfo = {...userPass}
        passInfo[key] = e.target.value
        setUserPass({...passInfo})
    }

    const submitInfo = (e) => {
        e.preventDefault()
        const info = userInfo
        groupomania.api.put('/user', {info})
            .then(result => setReload(true))
    }

    const handleUpdatePass = (e) => {
        e.preventDefault()
        const info = userPass
        groupomania.api.put('/user/password', {info})
            .then(result => {
                setUserPass({
                    oldPass: '',
                    newPass: '',
                    newPassVerif:''
                })
            })
    }

    const handleUpdateAvatar = (e) => {
        e.preventDefault()
        avatarRef.current.click()
    }

    const handleImageChange = (e) => {
        const avatar = avatarRef.current
        const image = imageRef.current
        setAvatar(avatar.files[0])
        if (avatar !== null) {
            const reader = new FileReader()
            reader.onload = (e) => {
                image.setAttribute('src', e.target.result)
            }
            if(avatarRef.current.files[0] !== undefined) {
                reader.readAsDataURL(avatarRef.current.files[0])
            } else {
                image.setAttribute('src', userInfo.avatar_url)
            }
        }
    }

    const handleSubmitAvatar = (e) => {
        e.preventDefault()
        if(!avatar) {
            alert('Aucune image')
        } else {
            const avatarUpdate = new FormData()
            avatarUpdate.append('avatar', avatar, avatar.name)
            const config = {
                headers: {
                    'Content-Type' : 'multipart/form-data; boundary=----WebKitFormBoundaryjmjNouh8CPOqGLDX'
                }
            }

            groupomania.api.put('/user', avatarUpdate, config)
                .then(result => setReload(true))
        }
    }

    const handleDisconnectedUser = (e) => {
        e.preventDefault()
        user.disconnectedUser()
        groupomania.setToken('')
        disconnected(false)
        delete localStorage.token
    }

    const handleDeleteAccount = (e) => {
        e.preventDefault()
        groupomania.api.delete(`/user/${user.id}`)
            .then(result => {
                user.disconnectedUser()
                groupomania.setToken('')
                disconnected(false)
            })
    }

    return (
        <div className={'setting'}>
            <div className={'setting__image'}>
                <img ref={imageRef} src={userInfo.avatar_url} />
                <form onSubmit={handleSubmitAvatar} className={'avatar-update'}>
                    <input onChange={handleImageChange} accept={'.png, .jpg, .jpeg, .gif'} ref={avatarRef} type={'file'}/>
                    <div className={'btn-avatar-submit'}>
                        <button onClick={handleUpdateAvatar}>Modifier</button>
                        <button type={'submit'}>Valider</button>
                    </div>
                </form>
            </div>
            <div className={'setting__form'}>
                <form className={'accout-info'} onSubmit={submitInfo}>
                    <div className='form--group'>
                        <div className='form--control'>
                            <label htmlFor='firstname'></label>
                            <input type='text' id='firstname' placeholder='Prénom' onChange={(e) => setInfo(e, 'firstname')} value={userInfo.firstname} name='firstname' />
                        </div>
                    </div>
                    <div className='form--group'>
                        <div className='form--control'>
                            <label htmlFor='lastname'></label>
                            <input type='text' id='lastname' placeholder='Nom de famille' onChange={(e) => setInfo(e, 'lastname')} value={userInfo.lastname} name='lastname' />
                        </div>
                    </div>
                    <div className='form--group'>
                        <div className='form--control'>
                            <label htmlFor='email'></label>
                            <input type='text' id='email' placeholder='Adresse email' onChange={(e) => setInfo(e, 'email')} value={userInfo.email} name='email' />
                        </div>
                    </div>
                    <button type={'submit'}>Mettre à jour les informations</button>
                </form>
                <div className={'divider'}></div>
                <form className={'accout-password'} onSubmit={handleUpdatePass}>
                    <div className='form--group'>
                        <div className='form--control'>
                            <label htmlFor='password'></label>
                            <input type='password' id='password' placeholder='Ancien mot de passe' onChange={(e) => changePass(e, 'oldPass')} value={userPass.oldPass} name='password' />
                        </div>
                    </div>
                    <div className='form--group'>
                        <div className='form--control'>
                            <label htmlFor='newPassword'></label>
                            <input type='password' id='newPassword' placeholder='Nouveau mot de passe' onChange={(e) => changePass(e, 'newPass')} value={userPass.newPass} name='newPassword' />
                        </div>
                    </div>
                    <div className='form--group'>
                        <div className='form--control'>
                            <label htmlFor='newPasswordVerif'></label>
                            <input type='password' id='newPasswordVerif' placeholder='Re-tapez nouveau mot de passe' onChange={(e) => changePass(e, 'newPassVerif')} value={userPass.newPassVerif} name='newPasswordVerif' />
                        </div>
                    </div>
                    <button type={'submit'}>Modifier le mot de passe</button>
                </form>
                <div className={'divider'}></div>
                <div className={'account-action'}>
                    <button onClick={handleDisconnectedUser}>Me déconnecter</button>
                    <button onClick={handleDeleteAccount}>Supprimer mon compte</button>
                </div>
            </div>
        </div>
    )
}

export default Setting