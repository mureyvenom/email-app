import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost/mail_app/react-api'
})