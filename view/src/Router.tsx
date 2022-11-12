import { FC } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { HomeComponent } from './components/Home'
import { ResetPasswordComponent, SignInComponent, SignOutComponent, SignUpComponent } from './components/Auth'
import { DashboardComponent } from './components/Dashboard'
import { CreateWorkspaceComponent, ViewWorkspaceComponent } from './components/Workspace'
import ErrorModule from './modules/ErrorModule'
import useDetectOffline from 'use-detect-offline'
import OfflineModule from './modules/OfflineModule'
import AccountComponent from './components/Account'

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
                <Route path='/auth/signup' element={<SignUpComponent />} />
                <Route path='/auth/signin' element={<SignInComponent />} />
                <Route path='/auth/pwreset' element={<ResetPasswordComponent />} />
                <Route path='/auth/signout' element={<SignOutComponent />} />
                <Route path='/dashboard' element={<DashboardComponent />} />
                <Route path='/workspace/create' element={<CreateWorkspaceComponent />} />
                <Route path='/workspace/view/:id' element={<ViewWorkspaceComponent />} />
                <Route path='/account' element={<AccountComponent />} />
                <Route path='*' element={<ErrorModule />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router