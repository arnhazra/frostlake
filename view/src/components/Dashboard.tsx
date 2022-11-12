//Import Statements
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import { Fragment, FC } from 'react'
import NavModule from '../modules/NavModule'
import useIdentity from '../hooks/useIdentity'
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
    const identity = useIdentity()
    const [state, setState] = useState({ instances: [], isLoaded: false })
    const navigate = useNavigate()
    ChartJS.register(ArcElement, Tooltip, Legend)

    const getDashBoardData = async () => {
        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
            const response = await axios.get('/api/dashboard')
            setState({ ...state, instances: response.data.instances, isLoaded: true })
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
    }

    useEffect(() => {
        getDashBoardData()
        const getLiveData = setInterval(() => getDashBoardData(), 25000)
        return () => clearInterval(getLiveData)
    }, [])

    const instancesToDisplay = state.instances.map(instance => {
        return <CardModule
            key={instance._id}
            heading={instance.instancename}
            heading1={instance.status === 'live' ? [<i className='fa-solid fa-shield fa-live' key={instance._id} title='Live'></i>] : [<i className='fa-solid fa-shield fa-off' key={instance._id} title='Turned Off'></i>]}
            link={`/instance/view/${instance._id}`}
            body1={`Instance is ${instance.status.toString().charAt(0).toUpperCase() + instance.status.toString().slice(1)}`}
            body2={`Created on ${moment(instance.date).format('MMM, Do YYYY, h:mm a')}`}
            body3={`Viewed on ${moment(instance.lastopened).format('MMM, Do YYYY, h:mm a')}`}
        />
    })

    //JSX
    return (
        <Fragment>
            <ReactIfModule condition={identity.isLoaded && state.isLoaded}>
                <NavModule />
                <Container>
                    <div className='mt-4 mb-4 p-5 hero'>
                        <p className='display-5 fw-bold'>Hi, {identity.name.split(' ')[0]}</p>
                        <p className='lead'>{Constants.DashboardTrayHeader1}</p>
                        <p className='lead'>{Constants.DashboardTrayHeader2}</p>
                        <Link className="btn" to='/instance/create'>Create Instance<i className='fa-solid fa-arrow-right-long'></i></Link>
                    </div>
                    <Row className='mt-4 mb-4'>
                        {instancesToDisplay}
                    </Row>
                </Container>
            </ReactIfModule>
            <ReactIfModule condition={!identity.isLoaded || !state.isLoaded}>
                <LoadingModule />
            </ReactIfModule>
        </Fragment>
    )
}

export { DashboardComponent }