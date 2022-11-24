//Import Statements
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Card, Col, Container, Nav, Navbar, Row, Table } from 'react-bootstrap'
import { Fragment, FC } from 'react'
import NavComponent from '../components/NavComponent'
import useAuth from '../hooks/useAuth'
import axios from 'axios'
import Snackbar from 'node-snackbar'
import Constants from '../Constants'
import moment from 'moment'
import LoadingComponent from '../components/LoadingComponent'
import { CSVLink } from 'react-csv'
import ErrorComponent from '../components/ErrorComponent'
import ReactIfComponent from '../components/ReactIfComponent'
import CardComponent from '../components/CardComponent'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

//Create Workspace Page
const CreateWorkspacePage: FC = () => {
    //Logic
    const { isLoaded } = useAuth()
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
            <ReactIfComponent condition={isLoaded}>
                <NavComponent />
                <form className='box' onSubmit={createWorkspace}>
                    <p className='branding mb-4'>Create Workspace</p>
                    <input type='text' name='name' placeholder='Your Workspace Name' onChange={(e) => setState({ ...state, name: e.target.value })} required autoComplete={'off'} />
                    <p id='alert'>{alert}</p>
                    <button type='submit' className='mt-2 btn btnbox'>Create Workspace<i className='fa-solid fa-play'></i></button><br />
                </form>
            </ReactIfComponent>
            <ReactIfComponent condition={!isLoaded}>
                <LoadingComponent />
            </ReactIfComponent>
        </Fragment>
    )
}

//Workspace Dashboard Page
const WorkspaceDashboardPage: FC = () => {
    //Logic
    const auth = useAuth()
    const [state, setState] = useState({ workspaces: [], isLoaded: false })
    const navigate = useNavigate()

    const getDashBoardData = async () => {
        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
            const response = await axios.post('/api/workspace/dashboard')
            setState({ ...state, workspaces: response.data.workspaces, isLoaded: true })
        }

        catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    localStorage.removeItem('accessToken')
                    navigate('/')
                }

                else {
                    Snackbar.show({ text: error.response.data.msg })
                }
            }
        }
    }

    useEffect(() => {
        getDashBoardData()
        const getLiveData = setInterval(() => getDashBoardData(), 25000)
        return () => clearInterval(getLiveData)
    }, [])

    const workspacesToDisplay = state.workspaces.map(workspace => {
        return <CardComponent
            key={workspace._id}
            heading={workspace.name}
            heading1={workspace.status === 'live' ? [<i className='fa-solid fa-shield fa-live' key={workspace._id} title='Live'></i>] : [<i className='fa-solid fa-shield fa-off' key={workspace._id} title='Turned Off'></i>]}
            link={`/workspace/view/${workspace._id}`}
            body1={`Workspace is ${workspace.status.toString().charAt(0).toUpperCase() + workspace.status.toString().slice(1)}`}
            body2={`Created on ${moment(workspace.date).format('MMM, Do YYYY, h:mm a')}`}
            body3={`Viewed on ${moment(workspace.lastopened).format('MMM, Do YYYY, h:mm a')}`}
        />
    })

    //JSX
    return (
        <Fragment>
            <ReactIfComponent condition={auth.isLoaded && state.isLoaded}>
                <NavComponent />
                <Container>
                    <div className='mt-4 mb-4 p-5 hero'>
                        <p className='display-5 fw-bold'>Hi, {auth.name.split(' ')[0]}</p>
                        <p className='lead'>{Constants.DashboardTrayHeader1}</p>
                        <p className='lead'>{Constants.DashboardTrayHeader2}</p>
                        <Link className='btn' to='/workspace/create'>Create Workspace<i className='fa-solid fa-play'></i></Link>
                    </div>
                    <Row className='mt-4 mb-4'>
                        {workspacesToDisplay}
                    </Row>
                </Container>
            </ReactIfComponent>
            <ReactIfComponent condition={!auth.isLoaded || !state.isLoaded}>
                <LoadingComponent />
            </ReactIfComponent>
        </Fragment>
    )
}

//Storage Page
const StoragePage: FC = () => {
    //Logic
    const auth = useAuth()
    const [state, setState] = useState({ workspaceCount: 0, analyticsDataCount: 0, isLoaded: false })
    const navigate = useNavigate()
    ChartJS.register(ArcElement, Tooltip, Legend)

    useEffect(() => {
        (async () => {
            try {
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
                const response = await axios.post('/api/workspace/storage')
                const { workspaceCount, analyticsDataCount } = response.data
                setState({ ...state, workspaceCount, analyticsDataCount, isLoaded: true })
            }

            catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        localStorage.removeItem('accessToken')
                        navigate('/')
                    }

                    else {
                        Snackbar.show({ text: error.response.data.msg })
                    }
                }
            }
        })()
    }, [])

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
            data: [state.workspaceCount, 10 - state.workspaceCount],
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
            <ReactIfComponent condition={auth.isLoaded && state.isLoaded}>
                <NavComponent />
                <Container className='mt-4'>
                    <Row className='mt-4 mb-4'>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6} className='mb-4'>
                            <Card>
                                <Card.Header className='cardhead ps-5 pt-4'>
                                    <p className='display-6 fw-bold'>Analytics Storage</p>
                                    <p className='lead fw-bold'>{(state.analyticsDataCount * 100 / 30000).toFixed(3)} % Used</p>
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
                                    <p className='lead fw-bold'>{state.workspaceCount * 100 / 10} % Used</p>
                                </Card.Header>
                                <Card.Body>
                                    <Doughnut data={workspaceData} options={{ aspectRatio: 2 }} />
                                </Card.Body>
                                <Card.Footer>
                                </Card.Footer>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </ReactIfComponent>
            <ReactIfComponent condition={!auth.isLoaded || !state.isLoaded}>
                <LoadingComponent />
            </ReactIfComponent>
        </Fragment >
    )
}

//View Workspace Page
const ViewWorkspacePage: FC = () => {
    //Logic
    const auth = useAuth()
    const [state, setState] = useState({ name: '', workspaceid: '', apikey: '', status: '', analyticsData: [], hasError: false, isLoaded: false })
    const navigate = useNavigate()
    let { id } = useParams()

    useEffect(() => {
        (async () => {
            try {
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
                const response = await axios.post(`/api/workspace/view/${id}`)
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
            const response = await axios.post(`/api/workspace/view/${id}`)
            setState({ ...state, name: response.data.workspace.name, workspaceid: response.data.workspace._id, apikey: response.data.workspace.apikey, analyticsData: response.data.analytics, isLoaded: true })
        }

        catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    localStorage.removeItem('accessToken')
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
                navigate('/workspace/dashboard')
            }

            catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        localStorage.removeItem('accessToken')
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
            const response = await axios.post(`/api/workspace/changestatus/${id}`)
            Snackbar.show({ text: response.data.msg })
            navigate('/workspace/dashboard')
        }

        catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    localStorage.removeItem('accessToken')
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
            <ReactIfComponent condition={auth.isLoaded && state.isLoaded}>
                <ReactIfComponent condition={!state.hasError}>
                    <NavComponent />
                    <Container className='mt-4'>
                        <Navbar variant='light' expand='lg' style={{ borderRadius: '50px' }}>
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
                                                    <td>{item.ipaddress}</td>
                                                    <td>{moment(item.date).format('MMMM Do YYYY, h:mm:ss a')}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </Container>
                </ReactIfComponent>
                <ReactIfComponent condition={state.hasError}>
                    <ErrorComponent />
                </ReactIfComponent>
            </ReactIfComponent>
            <ReactIfComponent condition={!auth.isLoaded || !state.isLoaded}>
                <LoadingComponent />
            </ReactIfComponent>
        </Fragment>
    )
}

export { CreateWorkspacePage, WorkspaceDashboardPage, StoragePage, ViewWorkspacePage } 