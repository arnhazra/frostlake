//Import Statements
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Snackbar from 'node-snackbar'
import Constants from '../Constants'

//useAUth Hook
const useAuth = () => {
    const [state, setState] = useState({ userid: '', name: '', isLoaded: false })
    const navigate = useNavigate()

    const verifyAuth = async () => {
        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
            const response = await axios.get('/api/auth/useauth')
            setState({ userid: response.data.user._id, name: response.data.user.name, isLoaded: true })
        }

        catch (error) {
            if (error.response.status === 401) {
                localStorage.removeItem('accessToken')
                navigate('/')
            }
        }
    }

    useEffect(() => {
        verifyAuth()
        const getRealtimeData = setInterval(() => verifyAuth(), 60000)

        return () => {
            clearInterval(getRealtimeData)
        }
    }, [])

    return state
}

//Export Statement
export default useAuth