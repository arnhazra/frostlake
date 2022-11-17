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

//Create Workspace Component
const CreateWorkspaceComponent: FC = () => {
    //Logic
    const { isLoaded } = useIdentity()
    const [state, setState] = useState({ name: '' })
    const [alert, setAlert] = useState('')
    const navigate = useNavigate()

    let createWorkspace = async (e: any) => {
        e.preventDefault()
        setAlert('Creating Workspace')

        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
            const response = await axios.post('/api/workspace/create', state)
            setAlert('Workspace Created')
            navigate(`/workspace/view/${response.data.workspace._id}`)
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
                <form className='box' onSubmit={createWorkspace}>
                    <p className='branding mb-4'>Create Workspace</p>
                    <input type='text' name='name' placeholder='Your Workspace Name' onChange={(e) => setState({ ...state, name: e.target.value })} required autoComplete={'off'} />
                    <p id='alert'>{alert}</p>
                    <button type='submit' className='mt-2 btn btnbox'>Create Workspace<i className='fa-solid fa-arrow-right-long'></i></button><br />
                </form>
            </ReactIfModule>
            <ReactIfModule condition={!isLoaded}>
                <LoadingModule />
            </ReactIfModule>
        </Fragment>
    )
}

//View Workspace Component
const ViewWorkspaceComponent: FC = () => {
    //Logic
    const identity = useIdentity()
    const [state, setState] = useState({ name: '', workspaceid: '', apikey: '', status: '', analyticsData: [], hasError: false, isLoaded: false })
    const navigate = useNavigate()
    let { id } = useParams()

    useEffect(() => {
        (async () => {
            try {
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
                const response = await axios.get(`/api/workspace/view/${id}`)
                setState({ ...state, name: response.data.workspace.name, workspaceid: response.data.workspace._id, apikey: response.data.workspace.apikey, status: response.data.workspace.status, analyticsData: response.data.analytics, isLoaded: true, hasError: false })
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
            const response = await axios.get(`/api/workspace/view/${id}`)
            setState({ ...state, name: response.data.workspace.name, workspaceid: response.data.workspace._id, apikey: response.data.workspace.apikey, analyticsData: response.data.analytics, isLoaded: true })
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

    const clearWorkspaceData = async (e) => {
        e.preventDefault()
        const confirmation = window.confirm(Constants.ClearWorkspaceDataMessage)

        if (confirmation) {
            try {
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
                await axios.delete(`/api/workspace/cleardata/${id}`)
                Snackbar.show({ text: 'Workspace data cleared' })
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
                        Snackbar.show({ text: 'Unable to clear workspace data' })
                    }
                }
            }
        }
    }

    const deleteWorkspace = async (e) => {
        e.preventDefault()
        const confirmation = window.confirm(Constants.DeleteWorkspaceMessage)

        if (confirmation) {
            try {
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
                await axios.delete(`/api/workspace/delete/${id}`)
                Snackbar.show({ text: 'Workspace Deleted' })
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
                        Snackbar.show({ text: 'Unable to delete workspace' })
                    }
                }
            }
        }
    }

    const changeWorkspaceStatus = async (e) => {
        e.preventDefault()

        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
            const response = await axios.get(`/api/workspace/changestatus/${id}`)
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
                    Snackbar.show({ text: 'Unable to turn off workspace' })
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
                        <Navbar variant='dark' expand='lg' style={{ borderRadius: '50px' }}>
                            <Container>
                                <Navbar.Brand>{state.name}</Navbar.Brand>
                                <Navbar.Toggle></Navbar.Toggle>
                                <Navbar.Collapse id='basic-navbar-nav'>
                                    <Nav className='ms-auto'>
                                        <Navbar.Brand onClick={(e) => syncData(e)}>Sync Data</Navbar.Brand>
                                        <CSVLink data={state.analyticsData} className='navbar-brand'>Save Data</CSVLink>
                                        <Navbar.Brand onClick={(e) => clearWorkspaceData(e)}>Clear Workspace Data</Navbar.Brand>
                                        <Navbar.Brand onClick={(e) => changeWorkspaceStatus(e)}>{state.status === 'live' ? 'Turn Off Workspace' : 'Turn On Workspace'}</Navbar.Brand>
                                        <Navbar.Brand onClick={(e) => deleteWorkspace(e)}>Delete Workspace</Navbar.Brand>
                                    </Nav>
                                </Navbar.Collapse>
                            </Container>
                        </Navbar>
                        <div className='mt-4 mb-4 p-5 hero'>
                            <p className='display-6 fw-bold'>Sample Request</p>
                            <div className='mb-4'>
                                curl --location --request POST {Constants.FrostlakeProdAPIURI} <br />
                                --header 'x-workspace-id: {state.workspaceid}' <br />
                                --header 'x-api-key: {state.apikey}' <br />
                                --header 'Content-Type: application/json' <br />
                                --data-raw '{JSON.stringify(Constants.SampleData, null, 2)}'
                            </div>
                        </div>
                        <div style={{ display: state.analyticsData.length > 0 ? 'block' : 'none' }}>
                            <Table responsive hover variant='light' id='table-to-xls'>
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

export { CreateWorkspaceComponent, ViewWorkspaceComponent } 