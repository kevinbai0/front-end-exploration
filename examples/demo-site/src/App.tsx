import React from 'react';
import './App.css';
import { Header, Card, Column, Row, Body, Button, Box } from "style-x";

function App() {
    return (
        <Box layout="col" p="breathe" bg="background">
            <Card layout="row" gap="breathe" justifyContent="start">
                <Body fg="primary" as="span">asdf</Body>
                <Body fg="primary" as="span">haha</Body>
            </Card>
            <Header mt="breathe" fg="action">Next</Header>

            <Box layout="row" justifyContent="space-around" my={5} bg="grey.2" mx="breathe" py="push">
                <Card>
                    <Body>Hello</Body>
                </Card>
                <Card>
                    <Body>World</Body>
                </Card>
                <Button>Button</Button>
            </Box>   
        </Box>
    );
}

export default App;
