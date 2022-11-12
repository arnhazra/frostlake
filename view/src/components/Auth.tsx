//Import Statements
import { Fragment, useEffect, useState, FC } from 'react'
import axios from 'axios'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import NavModule from '../modules/NavModule'
import LoadingModule from '../modules/LoadingModule'
import Constants from '../Constants'
import ReactIfModule from '../modules/ReactIfModule'

//Sign Up Component
const SignUpComponent: FC = () => {
    const [signupstep, setSignupstep] = useState({ firststep: true, secondstep: false })
    const [state, setState] = useState({ name: '', email: '', password: '', hash: '', otp: '' })
    const [alert, setAlert] = useState('')
    const navigate = useNavigate()

    let getOTPSignUp = async (e: any) => {
        e.preventDefault()
        setAlert(Constants.WaitMessage)

        try {
            const response = await axios.post('/api/auth/signup/getotp', state)
            setState({ ...state, hash: response.data.hash })
            setAlert(response.data.msg)
            setSignupstep({ firststep: false, secondstep: true })
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

    let register = async (e: any) => {
        e.preventDefault()
        setAlert(Constants.AccountCreateMessage)

        try {
            const response = await axios.post('/api/auth/signup/register', state)
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`
            localStorage.setItem('accessToken', response.data.accessToken)
            setAlert('Sign up success')
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
                <ReactIfModule condition={signupstep.firststep}>
                    <form className='box' onSubmit={getOTPSignUp}>
                        <p className='branding'>Sign Up</p>
                        <input type='text' name='name' placeholder='Your Name' onChange={(e) => setState({ ...state, name: e.target.value })} required autoComplete={'off'} minLength={3} maxLength={40} />
                        <input type='email' name='email' placeholder='Email Address' onChange={(e) => setState({ ...state, email: e.target.value })} required autoComplete={'off'} minLength={4} maxLength={40} />
                        <p id='alert'>{alert}</p>
                        <button type='submit' className='mt-2 btn btnbox'>Continue<i className='fa-solid fa-arrow-right-long'></i></button><br />
                    </form>
                </ReactIfModule>
                <ReactIfModule condition={signupstep.secondstep}>
                    <form className='box' onSubmit={register}>
                        <p className='branding'>Auth Code</p>
                        <input type='password' name='password' placeholder='Choose a Password' onChange={(e) => setState({ ...state, password: e.target.value })} required autoComplete={'off'} minLength={8} maxLength={20} />
                        <input type='password' name='otp' placeholder='Enter OTP sent to you' onChange={(e) => setState({ ...state, otp: e.target.value })} required autoComplete={'off'} minLength={6} maxLength={6} />
                        <p id='alert'>{alert}</p>
                        <button type='submit' className='mt-2 btn btnbox'>Sign Up<i className='fa-solid fa-arrow-right-long'></i></button>
                    </form>
                </ReactIfModule>
            </ReactIfModule>

        </Fragment>
    )
}

//Sign In Component
const SignInComponent: FC = () => {
    const [signinstep, setSigninstep] = useState({ firststep: true, secondstep: false })
    const [state, setState] = useState({ name: '', email: '', password: '', hash: '', otp: '' })
    const [alert, setAlert] = useState('')
    const navigate = useNavigate()

    let getOTPSignIn = async (e: any) => {
        e.preventDefault()
        setAlert(Constants.WaitMessage)

        try {
            const response = await axios.post('/api/auth/signin/getotp', state)
            setState({ ...state, hash: response.data.hash })
            setAlert(response.data.msg)
            setSigninstep({ firststep: false, secondstep: true })
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

    let login = async (e: any) => {
        e.preventDefault()
        setAlert(Constants.SignInMessage)

        try {
            const response = await axios.post('/api/auth/signin/login', state)
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`
            localStorage.setItem('accessToken', response.data.accessToken)
            setAlert('Sign In Success')
            navigate('/dashboard')
        }

        catch (error: any) {
            if (error.response.data.msg) {
                setAlert(error.response.data?.msg)
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
                <ReactIfModule condition={signinstep.firststep}>
                    <form className='box' onSubmit={getOTPSignIn}>
                        <p className='branding'>Sign In</p>
                        <input type='email' name='email' placeholder='Email Address' onChange={(e) => setState({ ...state, email: e.target.value })} required autoComplete={'off'} />
                        <input type='password' name='password' placeholder='Password' onChange={(e) => setState({ ...state, password: e.target.value })} required autoComplete={'off'} />
                        <p id='alert'>{alert}</p>
                        <button type='submit' className='mt-2 btn btnbox'>Continue<i className='fa-solid fa-arrow-right-long'></i></button><br />
                        <Link to='/auth/pwreset'>Forgot your password? Reset here</Link>
                    </form>
                </ReactIfModule>
                <ReactIfModule condition={signinstep.secondstep}>
                    <form className='box' onSubmit={login}>
                        <p className='branding'>Auth Code</p>
                        <input type='text' name='otp' placeholder='Enter OTP sent to you' onChange={(e) => setState({ ...state, otp: e.target.value })} required autoComplete={'off'} minLength={6} maxLength={6} />
                        <p id='alert'>{alert}</p>
                        <button type='submit' className='mt-2 btn btnbox'>Sign In<i className='fa-solid fa-arrow-right-long'></i></button>
                    </form>
                </ReactIfModule>
            </ReactIfModule>
        </Fragment>
    )
}

//Reset Password Component
const ResetPasswordComponent: FC = () => {
    const [pwresetstep, setPwresetstep] = useState({ firststep: true, secondstep: false })
    const [state, setState] = useState({ name: '', email: '', password: '', hash: '', otp: '' })
    const [alert, setAlert] = useState('')
    const navigate = useNavigate()

    let getOTPPwReset = async (e: any) => {
        e.preventDefault()
        setAlert(Constants.WaitMessage)

        try {
            const response: any = await axios.post('/api/auth/pwreset/getotp', state)
            setState({ ...state, hash: response.data.hash })
            setAlert(response.data.msg)
            setPwresetstep({ firststep: false, secondstep: true })
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

    let resetPassword = async (e: any) => {
        e.preventDefault()
        setAlert(Constants.PasswordResetMessage)

        try {
            const response = await axios.post('/api/auth/pwreset/reset', state)
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`
            localStorage.setItem('accessToken', response.data.accessToken)
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
            </ReactIfModule >
            <ReactIfModule condition={!localStorage.hasOwnProperty('accessToken')}>
                <NavModule />
                <ReactIfModule condition={pwresetstep.firststep}>
                    <form className='box' onSubmit={getOTPPwReset}>
                        <p className='branding'>Reset Password</p>
                        <input type='email' name='email' placeholder='Email Address' onChange={(e) => setState({ ...state, email: e.target.value })} required autoComplete={'off'} />
                        <p id='alert'>{alert}</p>
                        <button type='submit' className='mt-2 btn btnbox'>Continue<i className='fa-solid fa-arrow-right-long'></i></button>
                    </form>
                </ReactIfModule>
                <ReactIfModule condition={pwresetstep.secondstep}>
                    <form className='box' onSubmit={resetPassword}>
                        <p className='branding'>Auth Code</p>
                        <input type='password' name='otp' placeholder='Enter OTP sent to you' onChange={(e) => setState({ ...state, otp: e.target.value })} required autoComplete={'off'} minLength={6} maxLength={6} />
                        <input type='password' name='password' placeholder='Enter New Passweod' defaultValue='' onChange={(e) => setState({ ...state, password: e.target.value })} required autoComplete={'off'} minLength={8} maxLength={20} />
                        <p id='alert'>{alert}</p>
                        <button type='submit' className='mt-2 btn btnbox'>Reset Password<i className='fa-solid fa-arrow-right-long'></i></button>
                    </form>
                </ReactIfModule>
            </ReactIfModule >
        </Fragment >
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
export { SignUpComponent, SignInComponent, ResetPasswordComponent, SignOutComponent }