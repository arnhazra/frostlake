import { Fragment } from 'react'

const OfflineComponent = () => {
    return (
        <Fragment>
            <div className='box text-center'>
                <p className='branding mb-4'>You're offline</p>
                <i className='fa-solid fa-circle-xmark fa-6x'></i><br /><br />
            </div>
        </Fragment>
    )
}

export default OfflineComponent