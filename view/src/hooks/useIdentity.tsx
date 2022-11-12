//Import Statements
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Snackbar from 'node-snackbar'
import Constants from '../Constants'

//Identity Hook
const useIdentity = () => {
    const [state, setState] = useState({ userid: '', name: '', isLoaded: false })
    const navigate = useNavigate()

    const verifyIdentity = async () => {
        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
            const response = await axios.get('/hooks/useidentity')
            setState({ userid: response.data.user._id, name: response.data.user.name, isLoaded: true })
        }

        catch (error) {
            if (error.response.status === 401) {
                localStorage.removeItem('accessToken')
                Snackbar.show({ text: Constants.SignOutMessage })
                navigate('/')
            }
        }
    }

    useEffect(() => {
        verifyIdentity()
        const getRealtimeData = setInterval(() => verifyIdentity(), 60000)

        return () => {
            clearInterval(getRealtimeData)
        }
    }, [])

    return state
}

//Export Statement
export default useIdentity