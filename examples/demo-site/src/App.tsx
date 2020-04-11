import React from 'react';
import './App.css';
import { Header, Card, Grid, Column, Row } from "style-x";

function App() {
    return (
        <Column p="shift" bg="background">
            <Grid as={Card}>
                <Header fg="primary">asdf</Header>
            </Grid>
            <Header mt={10} fg="action">Next</Header>

            <Row justify="space-around" my={5} bg="grey.2" mx="breathe">
                <Card>
                    Hello
                </Card>
                <Card>
                    World
                </Card>
            </Row>
        </Column>
    );
}

export default App;
