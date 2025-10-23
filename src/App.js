import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import ChatBot from './components/ChatBot/ChatBot';
import './App.scss';

const theme = createTheme({
    palette: {
        primary: {
            main: '#3b82f6',
            dark: '#1e40af',
        },
        secondary: {
            main: '#64748b',
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
    },
    shape: {
        borderRadius: 12,
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="App">
                <ChatBot />
            </div>
        </ThemeProvider>
    );
}

export default App;