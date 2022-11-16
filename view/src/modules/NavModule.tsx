//Import Statements
import { Fragment } from 'react'
import { Container, Navbar, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ReactIfModule from './ReactIfModule'

//Navigation Module Component
const NavModule = () => {
    return (
        <Fragment>
            <ReactIfModule condition={localStorage.hasOwnProperty('accessToken')}>
                <Navbar variant='dark' expand='lg'>
                    <Container>
                        <Link to='/dashboard'>
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
                                <Link to='/account'><Navbar.Brand>Account</Navbar.Brand></Link>
                                <Link to='/auth/signout'><Navbar.Brand>Sign Out</Navbar.Brand></Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </ReactIfModule>
            <ReactIfModule condition={!localStorage.hasOwnProperty('accessToken')}>
                <Navbar variant='dark' expand='lg'>
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
            </ReactIfModule>
        </Fragment>
    )
}
//Export Statement
export default NavModule