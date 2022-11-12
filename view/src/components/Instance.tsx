//Import Statements
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Container, Nav, Navbar, Table } from 'react-bootstrap'
import { Fragment, FC } from 'react'
import NavModule from '../modules/NavModule'
import useIdentity from '../hooks/useIdentity'
import axios from 'axios'
import Snackbar from 'node-snackbar'
import Constants from '../Constants'
import moment from 'moment'
import LoadingModule from '../modules/LoadingModule'
import { CSVLink } from 'react-csv'
import ErrorModule from '../modules/ErrorModule'
import ReactIfModule from '../modules/ReactIfModule'

//Create Instance Component
const CreateInstanceComponent: FC = () => {
    //Logic
    const { isLoaded } = useIdentity()
    const [state, setState] = useState({ instancename: '' })
    const [alert, setAlert] = useState('')
    const navigate = useNavigate()

    let createInstance = async (e: any) => {
        e.preventDefault()
        setAlert('Creating Instance')

        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
            const response = await axios.post('/api/instance/create', state)
            setAlert('Instance Created')
            navigate(`/instance/view/${response.data.instance._id}`)
        }

        catch (error: any) {
            if (error.response) {
                if (error.response.status === 401) {
                    localStorage.removeItem('accessToken')
                    Snackbar.show({ text: Constants.SignOutMessage })
                    navigate('/')
                }

                else {
                    setAlert(error.response.data.msg)
                }
            }
        }
    }

    //JSX
    return (
        <Fragment>
            <ReactIfModule condition={isLoaded}>
                <NavModule />
                <form className='box' onSubmit={createInstance}>
                    <p className='branding mb-4'>Create Instance</p>
                    <input type='text' name='instancename' placeholder='Your Instance Name' onChange={(e) => setState({ ...state, instancename: e.target.value.toLowerCase() })} required autoComplete={'off'} />
                    <p id='alert'>{alert}</p>
                    <button type='submit' className='mt-2 btn btnbox'>Create Instance<i className="fa-solid fa-arrow-right-long"></i></button><br />
                </form>
            </ReactIfModule>
            <ReactIfModule condition={!isLoaded}>
                <LoadingModule />
            </ReactIfModule>
        </Fragment>
    )
}

//View Instance Component
const ViewInstanceComponent: FC = () => {
    //Logic
    const identity = useIdentity()
    const [state, setState] = useState({ instancename: '', instanceid: '', apikey: '', status: '', analyticsData: [], hasError: false, isLoaded: false })
    const navigate = useNavigate()
    let { id } = useParams()

    useEffect(() => {
        (async () => {
            try {
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
                const response = await axios.get(`/api/instance/view/${id}`)
                setState({ ...state, instancename: response.data.instance.instancename, instanceid: response.data.instance._id, apikey: response.data.instance.apikey, status: response.data.instance.status, analyticsData: response.data.analytics, isLoaded: true, hasError: false })
            }

            catch (error) {
                setState({ ...state, hasError: true, isLoaded: true })
            }
        })()
    }, [])

    const syncData = async (e) => {
        e.preventDefault()
        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
            const response = await axios.get(`/api/instance/view/${id}`)
            setState({ ...state, instancename: response.data.instance.instancename, instanceid: response.data.instance._id, apikey: response.data.instance.apikey, analyticsData: response.data.analytics, isLoaded: true })
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
        Snackbar.show({ text: Constants.SyncCompleteMessage })
    }

    const clearInstanceData = async (e) => {
        e.preventDefault()
        const confirmation = window.confirm(Constants.ClearInstanceDataMessage)

        if (confirmation) {
            try {
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
                await axios.delete(`/api/instance/cleardata/${id}`)
                Snackbar.show({ text: 'Instance data cleared' })
                navigate('/')
            }

            catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        localStorage.removeItem('accessToken')
                        Snackbar.show({ text: Constants.SignOutMessage })
                        navigate('/')
                    }

                    else {
                        Snackbar.show({ text: 'Unable to clear instance data' })
                    }
                }
            }
        }
    }

    const deleteInstance = async (e) => {
        e.preventDefault()
        const confirmation = window.confirm(Constants.DeleteInstanceMessage)

        if (confirmation) {
            try {
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
                await axios.delete(`/api/instance/delete/${id}`)
                Snackbar.show({ text: 'Instance Deleted' })
                navigate('/dashboard')
            }

            catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        localStorage.removeItem('accessToken')
                        Snackbar.show({ text: Constants.SignOutMessage })
                        navigate('/')
                    }

                    else {
                        Snackbar.show({ text: 'Unable to delete instance' })
                    }
                }
            }
        }
    }

    const changeInstanceStatus = async (e) => {
        e.preventDefault()

        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
            const response = await axios.get(`/api/instance/changestatus/${id}`)
            Snackbar.show({ text: response.data.msg })
            navigate('/dashboard')
        }

        catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    localStorage.removeItem('accessToken')
                    Snackbar.show({ text: Constants.SignOutMessage })
                    navigate('/')
                }

                else {
                    Snackbar.show({ text: 'Unable to turn off instance' })
                }
            }
        }
    }

    //JSX
    return (
        <Fragment>
            <ReactIfModule condition={identity.isLoaded && state.isLoaded}>
                <ReactIfModule condition={!state.hasError}>
                    <NavModule />
                    <Container className='mt-4'>
                        <Navbar variant='dark' expand='lg' style={{ borderRadius: "50px" }}>
                            <Container>
                                <Navbar.Brand>{state.instancename}</Navbar.Brand>
                                <Navbar.Toggle></Navbar.Toggle>
                                <Navbar.Collapse id='basic-navbar-nav'>
                                    <Nav className='ms-auto'>
                                        <Navbar.Brand onClick={(e) => syncData(e)}>Sync Data</Navbar.Brand>
                                        <CSVLink data={state.analyticsData} className='navbar-brand'>Save Data</CSVLink>
                                        <Navbar.Brand onClick={(e) => clearInstanceData(e)}>Clear Instance Data</Navbar.Brand>
                                        <Navbar.Brand onClick={(e) => changeInstanceStatus(e)}>{state.status === 'live' ? 'Turn Off Instance' : 'Turn On Instance'}</Navbar.Brand>
                                        <Navbar.Brand onClick={(e) => deleteInstance(e)}>Delete Instance</Navbar.Brand>
                                    </Nav>
                                </Navbar.Collapse>
                            </Container>
                        </Navbar>
                        <div className='mt-4 mb-4 p-5 hero'>
                            <p className='display-6 fw-bold'>Sample Request</p>
                            <div className='mb-4'>
                                curl --location --request POST {Constants.FrostlakeProdAPIURI} <br />
                                --header 'x-instance-id: {state.instanceid}' <br />
                                --header 'x-api-key: {state.apikey}' <br />
                                --header 'Content-Type: application/json' <br />
                                --data-raw '{JSON.stringify(Constants.SampleData, null, 2)}'
                            </div>
                        </div>
                        <div style={{ display: state.analyticsData.length > 0 ? 'block' : 'none' }}>
                            <Table responsive hover variant='dark' id='table-to-xls'>
                                <thead>
                                    <tr>
                                        <th>Component</th>
                                        <th>Event</th>
                                        <th>Info</th>
                                        <th>Status Code</th>
                                        <th>IP Address</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        state.analyticsData.map(item => {
                                            return (
                                                <tr key={item._id}>
                                                    <td>{item.component}</td>
                                                    <td>{item.event}</td>
                                                    <td>{item.info}</td>
                                                    <td>{item.statusCode}</td>
                                                    <td>{item.ipaddr || item.ipaddress}</td>
                                                    <td>{moment(item.date).format('MMMM Do YYYY, h:mm:ss a')}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </Container>
                </ReactIfModule>
                <ReactIfModule condition={state.hasError}>
                    <ErrorModule />
                </ReactIfModule>
            </ReactIfModule>
            <ReactIfModule condition={!identity.isLoaded || !state.isLoaded}>
                <LoadingModule />
            </ReactIfModule>
        </Fragment>
    )
}

export { CreateInstanceComponent, ViewInstanceComponent } 