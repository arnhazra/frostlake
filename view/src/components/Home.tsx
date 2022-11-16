//Import Statements
import { Navigate, Link } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { Fragment, FC } from 'react'
import NavModule from '../modules/NavModule'
import Constants from '../Constants'
import ReactIfModule from '../modules/ReactIfModule'

//Home Component
const HomeComponent: FC = () => {
    //JSX
    return (
        <Fragment>
            <NavModule />
            <ReactIfModule condition={localStorage.hasOwnProperty('accessToken')}>
                <Navigate replace to='/dashboard' />
            </ReactIfModule>
            <ReactIfModule condition={!localStorage.hasOwnProperty('accessToken')}>
                <Container>
                    <div className='cover covertext'>
                        <p className='display-3 fw-bold'>{Constants.HomeHeader1} <br /> {Constants.HomeHeader2}</p>
                        <p className='lead my-4 fw-bold'>{Constants.HomeIntro1}<br /> {Constants.HomeIntro2}</p>
                        <Link to='/auth' className='btn'>Get Started<i className='fa-solid fa-arrow-right-long'></i></Link>
                    </div>
                </Container>
            </ReactIfModule>

        </Fragment>
    )
}

export { HomeComponent }