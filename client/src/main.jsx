import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './components/Themecontext.jsx'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
    <ThemeProvider>
        <App />
        <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: "20px",
              },
            }}
          />
    </ThemeProvider>
)
