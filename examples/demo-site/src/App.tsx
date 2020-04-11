import React from 'react';
import './App.css';
import { Header, Card, Grid, Column, Row, Body } from "style-x";

function App() {
    return (
        <Column p="breathe" bg="background">
            <Grid as={Card}>
                <Body fg="primary">asdf</Body>
            </Grid>
            <Header mt="breathe" fg="action">Next</Header>

            <Row justify="space-around" my={5} bg="grey.2" mx="breathe">
                <Card>
                    <Body>Hello</Body>
                </Card>
                <Card>
                    <Body>World</Body>
                </Card>
            </Row>
        </Column>
    );
}

export default App;
