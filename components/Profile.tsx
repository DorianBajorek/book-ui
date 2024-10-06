// Profile.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Profile = () => {
    return ( // Make sure to return the JSX
        <View style={styles.container}>
            <Text>Profile Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Profile;
