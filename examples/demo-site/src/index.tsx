import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createTheme, ThemeProvider } from 'style-x'

const newTheme = {
    colors: {
       primary: "#B399F8",
       background: "#FFFFFF",
       "grey.2": "#DDDDDD"
    },
    fontFamily: {
        mainFont: "Roboto"
    },
    border: {
        ghost: "1px solid greys.1",
        action: "1px solid action"
    }
}

const theme = createTheme(newTheme)
declare module "../../../dist/types/src/theme/types.d" {
    type NewTheme = typeof newTheme
    export interface ThemeExtension extends NewTheme {}
}

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
