//Import Statements
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import { Fragment, FC } from 'react'
import NavModule from '../modules/NavModule'
import useAuth from '../hooks/useAuth'
import axios from 'axios'
import Snackbar from 'node-snackbar'
import Constants from '../Constants'
import CardModule from '../modules/CardModule'
import LoadingModule from '../modules/LoadingModule'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import moment from 'moment'
import ReactIfModule from '../modules/ReactIfModule'

//Dashboard Component
const DashboardComponent: FC = () => {
    //Logic
    const auth = useAuth()
    const [state, setState] = useState({ workspaces: [], isLoaded: false })
    const navigate = useNavigate()
    ChartJS.register(ArcElement, Tooltip, Legend)

    const getDashBoardData = async () => {
        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
            const response = await axios.get('/api/dashboard')
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
        return <CardModule
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
            <ReactIfModule condition={auth.isLoaded && state.isLoaded}>
                <NavModule />
                <Container>
                    <div className='mt-4 mb-4 p-5 hero'>
                        <p className='display-5 fw-bold'>Hi, {auth.name.split(' ')[0]}</p>
                        <p className='lead'>{Constants.DashboardTrayHeader1}</p>
                        <p className='lead'>{Constants.DashboardTrayHeader2}</p>
                        <Link className='btn' to='/workspace/create'>Create Workspace<i className='fa-solid fa-arrow-right-long'></i></Link>
                    </div>
                    <Row className='mt-4 mb-4'>
                        {workspacesToDisplay}
                    </Row>
                </Container>
            </ReactIfModule>
            <ReactIfModule condition={!auth.isLoaded || !state.isLoaded}>
                <LoadingModule />
            </ReactIfModule>
        </Fragment>
    )
}

export { DashboardComponent }