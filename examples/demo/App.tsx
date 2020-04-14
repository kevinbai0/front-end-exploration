import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';

import { Box } from 'style-x/native';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
        >
          <Box></Box>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default App;
