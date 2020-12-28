const SignupForm = ({ user, error, changeInput, submitForm }) => {
    return (
        <form onSubmit={submitForm}>
          <div className='form--group'>
            <div className='form--control'>
              <label htmlFor='email'></label>
              <input type='email' id='email' placeholder='Adresse e-mail' name='email' onChange={(e) => changeInput(e, 'email')} value={user.email} />
            </div>
          </div>
          <div className='form--group'>
            <div className='form--control'>
              <label htmlFor='password'></label>
              <input type='text' id='lastname' placeholder='Nom' name='lastname' onChange={(e) => changeInput(e, 'lastname')} value={user.lastname} />
            </div>
          </div>
          <div className='form--group'>
            <div className='form--control'>
              <label htmlFor='firstname'></label>
              <input type='firstname' id='text' placeholder='Prénom' name='firstname' onChange={(e) => changeInput(e, 'firstname')} value={user.firstname} />
            </div>
          </div>
          <div className='form--group'>
            <div className='form--control'>
              <label htmlFor='password'></label>
              <input type='password' id='password' placeholder='Mot de passe' name='password' onChange={(e) => changeInput(e, 'password')} value={user.password} />
            </div>
          </div>
          <div className='form--group'>
            <div className='form--control'>
              <label htmlFor='passVerif'></label>
              <input type='password' id='passVerif' placeholder='Re-tapez votre mot de passe' name='passVerif' onChange={(e) => changeInput(e, 'passVerif')} value={user.passVerif} />
            </div>
          </div>
          <button className='btn btn--form' type='submit'>S'inscrire</button>
          <p></p>
        </form>
        
    )
}

export default SignupForm
