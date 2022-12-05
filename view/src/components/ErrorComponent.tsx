import { Fragment } from 'react'

const ErrorComponent = () => {
    return (
        <Fragment>
            <div className='box text-center'>
                <p className='branding mb-4'>404, Lost</p>
                <i className='fa-solid fa-circle-exclamation fa-4x'></i><br /><br />
                <button onClick={() => window.history.back()} className='btn mt-2 btnbox'><i className='fa-solid fa-circle-arrow-left'></i>Go Back</button>
            </div>
        </Fragment>
    )
}

export default ErrorComponent