//Import Statements
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'node-snackbar/dist/snackbar.min.css'
import './styles/main.sass'
import App from './App'

//React Render
const container = document.getElementById('root')
const root = createRoot(container as any)
root.render(<App />)