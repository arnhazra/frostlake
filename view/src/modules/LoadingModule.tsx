//Import Statements
import { Fragment } from 'react'
import NavModule from './NavModule'

//Loading Module Component
const LoadingModule = () => {
    return (
        <Fragment>
            <NavModule />
            <div className='cover text-center'>
                <i className='fas fa-spinner fa-pulse fa-6x'></i>
            </div>
        </Fragment>
    )
}

//Export Statement
export default LoadingModule