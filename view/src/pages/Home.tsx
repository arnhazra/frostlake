//Import Statements
import { Navigate, Link } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { Fragment, FC } from 'react'
import NavComponent from '../components/NavComponent'
import Constants from '../Constants'
import ReactIfComponent from '../components/ReactIfComponent'

//Home Component
const HomeComponent: FC = () => {
    //JSX
    return (
        <Fragment>
            <NavComponent />
            <ReactIfComponent condition={localStorage.hasOwnProperty('accessToken')}>
                <Navigate replace to='/workspace/dashboard' />
            </ReactIfComponent>
            <ReactIfComponent condition={!localStorage.hasOwnProperty('accessToken')}>
                <Container>
                    <div className='cover covertext'>
                        <p className='display-3 fw-bold'>{Constants.HomeHeader1} <br /> {Constants.HomeHeader2}</p>
                        <p className='lead my-4 fw-bold'>{Constants.HomeIntro1}<br /> {Constants.HomeIntro2} <br />{Constants.HomeIntro3}</p>
                        <Link to='/auth' className='btn'>Get Started<i className="fa-solid fa-play"></i></Link>
                    </div>
                </Container>
            </ReactIfComponent>

        </Fragment>
    )
}

export { HomeComponent }