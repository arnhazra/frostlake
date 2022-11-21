import { FC } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { HomeComponent } from './components/Home'
import { AuthComponent, SignOutComponent } from './components/Auth'
import { CreateWorkspaceComponent, StorageComponent, ViewWorkspaceComponent, WorkspaceDashboardComponent } from './components/Workspace'
import ErrorModule from './modules/ErrorModule'
import useDetectOffline from 'use-detect-offline'
import OfflineModule from './modules/OfflineModule'

//UI Router
const Router: FC = () => {
    //LOGIC
    const { offline } = useDetectOffline()

    //JSX
    if (offline) {
        return <OfflineModule />
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<HomeComponent />} />
                <Route path='/auth' element={<AuthComponent />} />
                <Route path='/auth/signout' element={<SignOutComponent />} />
                <Route path='/workspace/dashboard' element={<WorkspaceDashboardComponent />} />
                <Route path='/workspace/create' element={<CreateWorkspaceComponent />} />
                <Route path='/workspace/view/:id' element={<ViewWorkspaceComponent />} />
                <Route path='/workspace/storage' element={<StorageComponent />} />
                <Route path='*' element={<ErrorModule />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router