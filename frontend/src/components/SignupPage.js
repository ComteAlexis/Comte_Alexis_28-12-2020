import React, { Component } from 'react'
import SignupForm from './SignupForm'
import heroImg from '../images/ville-banner.jpg'
import Image from './icon/groupomania'
import { Link } from 'react-router-dom'
import groupomania from '../js/Groupomania'

class SignupPage extends Component{
    state= {
        user:{
            email: '',
            lastname: '',
            password: '',
            passVerif: '',
            firstname: ''
        }
    }

    componentDidMount() {
        document.title = 'S\'inscrire'
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const {addNotif} = this.props
        groupomania.api.post('/user/signup', {...this.state.user})
            .then(result => {
                addNotif('Inscription Validé', 'Rendez vous sur la page login pour vous connecter')
                const user = {
                    email: '',
                    lastname: '',
                    password: '',
                    passVerif: '',
                    firstname: ''
                }
                this.setState({user})
            })
            .catch(error => {
                addNotif('Erreur d\'inscription', error.response.data.error)
            })
    }

    handleChange = (event, key) => {
        const user = {...this.state.user}
        user[key] = event.target.value
        this.setState({ user })
    }

    render(){
        return(
            <div className='signup-system'>
                <div className='hero-log'>
                    <img alt='building new-york' width="100%" src={heroImg} />
                </div>
                <div className='signup-form'>
                    <Image height='40px' />
                    <SignupForm submitForm={this.handleSubmit} user={this.state.user} changeInput={this.handleChange} />
                    <Link to='/login'>Déjà inscrit? Me connecter</Link>
                </div>
            </div>
        )
    }
}

export default SignupPage
