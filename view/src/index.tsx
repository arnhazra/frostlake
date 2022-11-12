//Import Statements
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'node-snackbar/dist/snackbar.min.css'
import './Style.sass'
import Router from './Router'

//React Render
const container = document.getElementById('root')
const root = createRoot(container as any)
root.render(<Router />)