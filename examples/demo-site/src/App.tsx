import React from 'react';
import { Box } from "style-x";
import RightUtilities from './components/RightUtiltities';


function App() {

    return (
        <Box display="row" rowLayout="1fr auto" bg="background" justifyItems="start" justifyContent="stretch" height="100vh" width="100vw">
            <Box width="100%" justify="center"></Box>
            <RightUtilities justify="end" />
        </Box>
    );
}

export default App;
