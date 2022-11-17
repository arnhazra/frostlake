//Import Statement
import { FC, Fragment, useState, useEffect } from 'react'
import useIdentity from '../hooks/useIdentity'
import LoadingModule from '../modules/LoadingModule'
import NavModule from '../modules/NavModule'
import ReactIfModule from '../modules/ReactIfModule'
import { useNavigate } from 'react-router-dom'
import { Card, Col, Row, Container } from 'react-bootstrap'
import axios from 'axios'
import Snackbar from 'node-snackbar'
import Constants from '../Constants'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

//Storage Component
const StorageComponent: FC = () => {
    //Logic
    const identity = useIdentity()
    const [state, setState] = useState({ workspaceCount: 0, analyticsDataCount: 0, isLoaded: false })
    const navigate = useNavigate()
    ChartJS.register(ArcElement, Tooltip, Legend)

    useEffect(() => {
        (async () => {
            try {
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
                const response = await axios.get('/api/storage/getdetails')
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
            <ReactIfModule condition={identity.isLoaded && state.isLoaded}>
                <NavModule />
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
            </ReactIfModule>
            <ReactIfModule condition={!identity.isLoaded || !state.isLoaded}>
                <LoadingModule />
            </ReactIfModule>
        </Fragment >
    )
}

//Export Statement
export default StorageComponent