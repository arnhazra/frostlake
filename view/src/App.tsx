import { FC } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { HomeComponent } from './pages/Home'
import { AuthComponent, SignOutComponent } from './pages/Auth'
import { CreateWorkspaceComponent, StorageComponent, ViewWorkspaceComponent, WorkspaceDashboardComponent } from './pages/Workspace'
import ErrorComponent from './components/ErrorComponent'
import useDetectOffline from 'use-detect-offline'
import OfflineComponent from './components/OfflineComponent'

//UI Router
const Router: FC = () => {
    //LOGIC
    const { offline } = useDetectOffline()

    //JSX
    if (offline) {
        return <OfflineComponent />
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
                <Route path='*' element={<ErrorComponent />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router