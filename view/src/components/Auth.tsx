//Import Statements
import { Fragment, useEffect, useState, FC } from 'react'
import axios from 'axios'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import NavModule from '../modules/NavModule'
import LoadingModule from '../modules/LoadingModule'
import Constants from '../Constants'
import ReactIfModule from '../modules/ReactIfModule'

//Auth Component
const AuthComponent: FC = () => {
    const [authstep, setAuthStep] = useState({ firststep: true, secondstep: false })
    const [state, setState] = useState({ name: '', email: '', hash: '', otp: '', newuser: false })
    const [alert, setAlert] = useState('')
    const navigate = useNavigate()

    const generateAuthcode = async (e: any) => {
        e.preventDefault()
        setAlert(Constants.WaitMessage)

        try {
            const response = await axios.post('/api/auth/generateauthcode', state)
            setState({ ...state, hash: response.data.hash, newuser: response.data.newuser })
            setAlert(response.data.msg)
            setAuthStep({ firststep: false, secondstep: true })
        }

        catch (error: any) {
            setAlert(Constants.ConnectionErrorMessage)
        }
    }

    const verifyAuthcode = async (e: any) => {
        e.preventDefault()
        setAlert(Constants.AccountCreateMessage)

        try {
            const response = await axios.post('/api/auth/verifyauthcode', state)
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`
            localStorage.setItem('accessToken', response.data.accessToken)
            setAlert('Successfully authenticated')
            navigate('/dashboard')
        }

        catch (error: any) {
            if (error.response) {
                setAlert(error.response.data.msg)
            }

            else {
                setAlert(Constants.ConnectionErrorMessage)
            }
        }
    }

    return (
        <Fragment>
            <ReactIfModule condition={localStorage.hasOwnProperty('accessToken')}>
                <Navigate replace to='/dashboard' />
            </ReactIfModule>
            <ReactIfModule condition={!localStorage.hasOwnProperty('accessToken')}>
                <NavModule />
                <ReactIfModule condition={authstep.firststep}>
                    <form className='box' onSubmit={generateAuthcode}>
                        <p className='branding'>Frostlake Auth</p>
                        <input type='email' name='email' placeholder='Email Address' onChange={(e) => setState({ ...state, email: e.target.value })} required autoComplete={'off'} minLength={4} maxLength={40} />
                        <p id='alert'>{alert}</p>
                        <button type='submit' id='btnnow' className='mt-2 btn btnbox'>Continue to frostlake<i className='fa-solid fa-arrow-right-long'></i></button><br />
                    </form>
                </ReactIfModule>
                <ReactIfModule condition={authstep.secondstep}>
                    <form className='box' onSubmit={verifyAuthcode}>
                        <p className='branding'>Frostlake Auth</p>
                        <ReactIfModule condition={state.newuser}>
                            <input type='text' name='name' placeholder='Your Name' onChange={(e) => setState({ ...state, name: e.target.value })} required autoComplete={'off'} minLength={3} maxLength={40} />
                        </ReactIfModule>
                        <input type='password' name='otp' placeholder='Enter auth code sent to you' onChange={(e) => setState({ ...state, otp: e.target.value })} required autoComplete={'off'} minLength={8} maxLength={8} />
                        <p id='alert'>{alert}</p>
                        <button type='submit' className='mt-2 btn btnbox'>{state.newuser ? 'Set up the account' : 'Continue to dashboard'}<i className='fa-solid fa-arrow-right-long'></i></button>
                    </form>
                </ReactIfModule>
            </ReactIfModule>
        </Fragment>
    )
}

//Sign Out Component
const SignOutComponent: FC = () => {
    //LOGIC
    const navigate = useNavigate()

    useEffect(() => {
        (async () => {
            try {
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
                await axios.get('/api/auth/signout')
                localStorage.removeItem('accessToken')
                navigate('/')
            }

            catch (error) {
                localStorage.removeItem('accessToken')
                navigate('/')
            }
        })()
    }, [])

    //JSX
    return <LoadingModule />
}

//Export Statement
export { AuthComponent, SignOutComponent }