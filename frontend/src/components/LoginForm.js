const LoginForm = ({ user, error, changeInput, handleSubmit }) => {
    return (
        <form onSubmit={handleSubmit}>
          <div className='form--group'>
            <div className='form--control'>
              <label htmlFor='email'><i className="far fa-user"></i></label>
              <input type='text' id='email' placeholder='Votre adresse email' name='email' onChange={(e) => changeInput(e, 'email')} value={user.email} />
            </div>
            {error.login ? <p>{error.login}</p> : ''}
          </div>
          <div className='form--group'>
            <div className='form--control'>
              <label htmlFor='password'><i className="fas fa-lock"></i></label>
              <input type='password' id='password' placeholder='Mot de passe' name='password' onChange={(e) => changeInput(e, 'password')} value={user.password} />
            </div>
            {error.password ? <p>{error.password}</p> : ''}
          </div>
          <a href='#fodkzfzk'>Mot de passe oublié ?</a>
          <button className='btn btn--form' type='submit'>Se connecter</button>
        </form>
        
    )
}

export default LoginForm
