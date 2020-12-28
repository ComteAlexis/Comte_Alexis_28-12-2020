import jwt from 'jsonwebtoken'

class User {

    isConnected = () => {
        if (this.token)
            return true
        else
            return false
    }

    disconnectedUser () {
        delete this.id
        delete this.token
        delete this.role
    }

    setToken (token) {
        this.token = token
        const tokenInfo = jwt.decode(token)
        if (tokenInfo.role) {
            this.role = tokenInfo.role
        }
        if(tokenInfo.userId) {
            this.id = tokenInfo.userId
        }
    }
}

const user = new User()

export default user