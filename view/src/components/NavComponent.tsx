//Import Statements
import { Fragment } from 'react'
import { Container, Navbar, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ReactIfComponent from './ReactIfComponent'

//Navigation Component Component
const NavComponent = () => {
    return (
        <Fragment>
            <ReactIfComponent condition={localStorage.hasOwnProperty('accessToken')}>
                <Navbar variant='light' expand='lg'>
                    <Container>
                        <Link to='/workspace/dashboard'>
                            <Navbar.Brand style={{ fontSize: '20px' }}>
                                <img
                                    alt=''
                                    src={window.location.origin + '/assets/favicon.png'}
                                    width='30'
                                    height='30'
                                    className='d-inline-block align-top'
                                />{' '}
                                Dashboard
                            </Navbar.Brand>
                        </Link>
                        <Navbar.Toggle></Navbar.Toggle>
                        <Navbar.Collapse id='basic-navbar-nav'>
                            <Nav className='ms-auto'>
                                <Link to='/workspace/storage'><Navbar.Brand>Storage</Navbar.Brand></Link>
                                <Link to='/auth/signout'><Navbar.Brand>Sign Out</Navbar.Brand></Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </ReactIfComponent>
            <ReactIfComponent condition={!localStorage.hasOwnProperty('accessToken')}>
                <Navbar variant='light' expand='lg'>
                    <Container>
                        <Link to='/'>
                            <Navbar.Brand style={{ fontSize: '20px' }}>
                                <img
                                    alt=''
                                    src={window.location.origin + '/assets/favicon.png'}
                                    width='30'
                                    height='30'
                                    className='d-inline-block align-top'
                                />{' '}
                                Frostlake
                            </Navbar.Brand>
                        </Link>
                        <Navbar.Toggle></Navbar.Toggle>
                        <Navbar.Collapse>
                            <Nav className='ms-auto'>
                                <Link to='/auth'><Navbar.Brand>Get Started</Navbar.Brand></Link>
                                <a target='_blank' rel='noopener noreferrer' href='https://www.linkedin.com/in/arnhazra/'><Navbar.Brand>Creator</Navbar.Brand></a>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </ReactIfComponent>
        </Fragment>
    )
}
//Export Statement
export default NavComponent