import React from 'react';
import { Box } from "style-x";
import RightUtilities from './components/RightUtiltities';
import Artboard from './components/Artboard';
import Toolkit from './components/Toolkit';


function App() {

    return (
        <Box display="row" rowLayout="auto 1fr auto" bg="background" justifyItems="start" justifyContent="stretch" height="100vh" width="100vw">
            <Toolkit /> 
            <Artboard width="fill" justify="center"/>
            <RightUtilities justify="end" />
        </Box>
    );
}

export default App;
