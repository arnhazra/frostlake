//Import Statement
import { FC, Fragment, useState, useEffect } from 'react'
import useIdentity from '../hooks/useIdentity'
import LoadingModule from '../modules/LoadingModule'
import NavModule from '../modules/NavModule'
import ReactIfModule from '../modules/ReactIfModule'
import { useNavigate } from 'react-router-dom'
import { Card, Col, Row, Container, Nav, Navbar } from 'react-bootstrap'
import axios from 'axios'
import Snackbar from 'node-snackbar'
import Constants from '../Constants'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

//Account Component
const AccountComponent: FC = () => {
    //Logic
    const identity = useIdentity()
    const [tab, setTab] = useState('accountstorage')
    const [state, setState] = useState({ workspaceCount: 0, analyticsDataCount: 0, isLoaded: false })
    const [credentials, setCredentials] = useState({ password: '' })
    const navigate = useNavigate()
    ChartJS.register(ArcElement, Tooltip, Legend)

    useEffect(() => {
        (async () => {
            try {
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
                const response = await axios.get('/api/account/getdetails')
                const { workspaceCount, analyticsDataCount } = response.data
                setState({ ...state, workspaceCount, analyticsDataCount, isLoaded: true })
            }

            catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        localStorage.removeItem('accessToken')
                        Snackbar.show({ text: Constants.SignOutMessage })
                        navigate('/')
                    }

                    else {
                        Snackbar.show({ text: error.response.data.msg })
                    }
                }
            }
        })()
    }, [])

    const changePassword = async (e: any) => {
        e.preventDefault()
        Snackbar.show({ text: Constants.ProfileUpdateMessage })

        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
            const res = await axios.post('/api/account/changepassword', state)
            Snackbar.show({ text: res.data.msg })
        }

        catch (error: any) {
            if (error.response) {
                if (error.response.status === 401) {
                    localStorage.removeItem('accessToken')
                    Snackbar.show({ text: Constants.SignOutMessage })
                    navigate('/')
                }

                else {
                    Snackbar.show({ text: error.response.data.msg })
                }
            }
        }
    }

    const analyticsData = {
        datasets: [{
            data: [state.analyticsDataCount, 30000 - state.analyticsDataCount],
            backgroundColor: ['#fde78f', '#aad6e0'],
            borderWidth: 4,
            borderColor: '#7a7a7a',
            borderRadius: 5,
            cutout: 0
        }]
    }

    const workspaceData = {
        datasets: [{
            data: [state.workspaceCount, 100 - state.workspaceCount],
            backgroundColor: ['#fde78f', '#aad6e0'],
            borderWidth: 4,
            borderColor: '#7a7a7a',
            borderRadius: 5,
            cutout: 0
        }]
    }

    //JSX
    return (
        <Fragment>
            <ReactIfModule condition={identity.isLoaded && state.isLoaded}>
                <NavModule />
                <Container className='mt-4'>
                    <Navbar variant='dark' expand='lg' style={{ borderRadius: "50px" }}>
                        <Container>
                            <Navbar.Brand onClick={() => setTab('accountstorage')}>Account Storage</Navbar.Brand>
                            <Navbar.Toggle></Navbar.Toggle>
                            <Navbar.Collapse id='basic-navbar-nav'>
                                <Nav className='ms-auto'>
                                    <Navbar.Brand onClick={() => setTab('changepassword')}>Change Password</Navbar.Brand>
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                    <Container className='mt-4'>
                        <ReactIfModule condition={tab === 'changepassword'}>
                            <form className='box' onSubmit={changePassword}>
                                <p className='branding mb-4'>Change Password</p>
                                <input type='password' id='new-password' autoComplete={'new-password'} name='password' placeholder='Old/New Password' onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} required minLength={8} maxLength={20} />
                                <button type='submit' className='btn mt-2 btnbox'>Update Password<i className='fa-solid fa-arrow-right-long'></i></button><br />
                            </form>
                        </ReactIfModule>
                        <ReactIfModule condition={tab === 'accountstorage'}>
                            <Row className='mt-4 mb-4'>
                                <Col xs={12} sm={12} md={6} lg={6} xl={6} className='mb-4'>
                                    <Card>
                                        <Card.Header className='cardhead ps-5 pt-4'>
                                            <p className='display-6 fw-bold'>Analytics Storage</p>
                                            <p className='lead fw-bold'>{(state.analyticsDataCount * 100 / 30000).toFixed(2)} % Used</p>
                                        </Card.Header>
                                        <Card.Body>
                                            <Doughnut data={analyticsData} options={{ aspectRatio: 2 }} />
                                        </Card.Body>
                                        <Card.Footer>
                                        </Card.Footer>
                                    </Card>
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6} xl={6} className='mb-4'>
                                    <Card>
                                        <Card.Header className='cardhead ps-5 pt-4'>
                                            <p className='display-6 fw-bold'>Workspace Storage</p>
                                            <p className='lead fw-bold'>{state.workspaceCount * 100 / 100} % Used</p>
                                        </Card.Header>
                                        <Card.Body>
                                            <Doughnut data={workspaceData} options={{ aspectRatio: 2 }} />
                                        </Card.Body>
                                        <Card.Footer>
                                        </Card.Footer>
                                    </Card>
                                </Col>
                            </Row>
                        </ReactIfModule>
                    </Container>
                </Container>
            </ReactIfModule>
            <ReactIfModule condition={!identity.isLoaded || !state.isLoaded}>
                <LoadingModule />
            </ReactIfModule>
        </Fragment>
    )
}

//Export Statement
export default AccountComponent