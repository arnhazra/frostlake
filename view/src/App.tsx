import { FC, Fragment } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { HomePage } from './pages/Home'
import { AuthPage, SignOutPage } from './pages/Auth'
import { CreateWorkspacePage, StoragePage, ViewWorkspacePage, WorkspaceDashboardPage } from './pages/Workspace'
import ErrorComponent from './components/ErrorComponent'
import useDetectOffline from 'use-detect-offline'
import OfflineComponent from './components/OfflineComponent'
import ReactIfComponent from './components/ReactIfComponent'

//UI Router
const Router: FC = () => {
    //LOGIC
    const { offline } = useDetectOffline()

    //JSX
    return (
        <Fragment>
            <ReactIfComponent condition={offline}>
                <OfflineComponent />
            </ReactIfComponent>
            <ReactIfComponent condition={!offline}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<HomePage />} />
                        <Route path='/auth' element={<AuthPage />} />
                        <Route path='/auth/signout' element={<SignOutPage />} />
                        <Route path='/workspace/dashboard' element={<WorkspaceDashboardPage />} />
                        <Route path='/workspace/create' element={<CreateWorkspacePage />} />
                        <Route path='/workspace/view/:id' element={<ViewWorkspacePage />} />
                        <Route path='/workspace/storage' element={<StoragePage />} />
                        <Route path='*' element={<ErrorComponent />} />
                    </Routes>
                </BrowserRouter>
            </ReactIfComponent>
        </Fragment>
    )
}

export default Router