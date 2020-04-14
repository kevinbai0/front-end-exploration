import React from 'react';
import './App.css';
import { Body, Button, Box, styled, Input } from "style-x";

// todo
const LeftPanel = styled(Box)`
    height: 98vh;
    width: 100px;
`

const SearchButton = styled(Button)`
    width: 40px;
    height: 40px;
`

function App() {
    return (
        <Box layout="row" bg="background" justifyItems="start" justifyContent="stretch">
            <LeftPanel layout="col" bg="primary" radius="big" my="1vh">
                
            </LeftPanel>
            <Box layout="col" ml="breathe" alignContent="start" my="breathe">
                <Box layout="row" alignItems="center" justifyContent="space-evenly">
                    <SearchButton bg="background" fg="foreground" shadow="default" px="none"></SearchButton>
                    <Input ml="breathe" type="text" placeholder="Search..." />
                    <Body>17 March 2020, Tuesday</Body>
                </Box>
            </Box>
        </Box>
    );
}

export default App;
