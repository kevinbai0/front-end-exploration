import React from 'react';
import './App.css';
import { Header, Card, Grid, Column, Row } from "style-x";

function App() {
    return (
        <Column p={20}>
            <Grid as={Card}>
                <Header fg="primary">asdf</Header>
            </Grid>
            <Header mt={10} fg="action">Next</Header>

            <Row justify="space-around" my={5} bg="greys">
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
