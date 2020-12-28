import axios from 'axios'

class Groupomania {
    constructor () {
        this.api = axios.create({
            baseURL: 'http://localhost:5500/api/',
            timeout: 1000
        })
    }

    setToken(token) {
        this.api = axios.create({
            baseURL: 'http://localhost:5500/api/',
            timeout: 1000,
            headers: {Authorization: 'bearer ' + token}
        })
    }
}

const groupomania = new Groupomania()

export default groupomania