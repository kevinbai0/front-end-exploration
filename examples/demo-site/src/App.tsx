import React from 'react';
import { Box } from "style-x";
import RightUtilities from './components/RightUtiltities';


function App() {

    return (
        <Box display="row" rowLayout="1fr auto" bg="background" justifyItems="start" justifyContent="stretch" height="100vh">
            <Box bg="action" width="100%" justify="center"></Box>
            <RightUtilities justify="end">

            </RightUtilities>
        </Box>
    );
}

export default App;
