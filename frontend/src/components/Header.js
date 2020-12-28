import React from 'react'
import { Link } from 'react-router-dom'
import Groupomania from './icon/groupomania'

const Header = () => {
    let burgerRef = React.createRef()

    const handleOpenBurger = () => {
        burgerRef.current.classList.toggle('open')
    }
    
    return (
        <header>
            <Groupomania color='#dfe6e9' height='35px' />
            <div className='burger-collapse' onClick={handleOpenBurger} ref={burgerRef}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <ul className='nav'>
                <li><Link to='/'>Accueil</Link></li>
                <li><Link to='/setting'>Mon compte</Link></li>
            </ul>
        </header>
    )
}

export default Header