import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Header, createTheme, ThemeProvider, styled } from "style-x";

const newTheme = {
    colors: {
        blue: "#00ff00"
    }
}

declare module "style-x" {
    type NewTheme = typeof newTheme
    export interface ThemeExtension extends NewTheme {}
}

const theme = createTheme(newTheme)

const A = styled.div`
    background-color: ${props => props.theme.colors.action};
    ${props => { console.log(props.theme); return ""} };
`

function App() {
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <A>asdf2</A>
                <Header fg="primary">asdf</Header>
                <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                </header>
            </div>
        </ThemeProvider>
    );
}

export default App;
