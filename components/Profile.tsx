
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUserData } from '../authentication/UserData';

const Profile = () => {

    const { email, userName } = useUserData();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile Screen</Text>
            <Text style={styles.label}>Email: {email}</Text>
            <Text style={styles.label}>Username: {userName}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        color: '#333',
    },
});

export default Profile;
