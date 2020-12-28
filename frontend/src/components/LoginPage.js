import React, { Component } from 'react'
import LoginForm from './LoginForm'
import heroImg from '../images/fond-hero.webp'
import Image from './icon/groupomania'
import { Link } from 'react-router-dom'

class LoginPage extends Component{
    state= {
        isConnected: this.props.user.isConnected(),
        user:{
            email: '',
            password: ''
        },
        error: {}
    }

    componentDidMount() {
        document.title = 'Me connecter'
    }

    handleChange = (event, key) => {
        const user = {...this.state.user}
        user[key] = event.target.value
        this.setState({ user })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { user, groupomania, onConnect, addNotif } = {...this.props}
        groupomania.api.post('/user/login', {...this.state.user})
            .then(result => {
                if(result.data.success === true){
                    user.setToken(result.data.token)
                    localStorage.setItem('token', result.data.token)
                    groupomania.setToken(user.token)
                    onConnect(user.isConnected())
                }
            })
            .catch(error => addNotif('Erreur d\'authentification', error.response.data ? error.response.data.error : 'Probleme'))
    }

    render(){
        return(
            <>
                <div className='log-system'>
                    <div className='hero-log'>
                        <img alt='réunion travail' width="100%" src={heroImg} />
                    </div>
                    <div className='login-form'>
                        <Image height='40px' />
                        <LoginForm handleSubmit={this.handleSubmit} user={this.state.user} error={this.state.error} changeInput={this.handleChange} />
                        <Link to='/signup'>Pas encore de compte? S'enregistrer</Link>
                    </div>
                </div>
            </>
        )
    }
}

export default LoginPage
