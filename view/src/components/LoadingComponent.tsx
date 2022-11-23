//Import Statements
import { Fragment } from 'react'
import NavComponent from './NavComponent'

//Loading Component Component
const LoadingComponent = () => {
    return (
        <Fragment>
            <NavComponent />
            <div className='cover text-center'>
                <i className='fa-solid fa-circle-notch fa-spin fa-6x'></i>
            </div>
        </Fragment>
    )
}

//Export Statement
export default LoadingComponent