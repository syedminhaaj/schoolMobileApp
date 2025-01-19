import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';

import {addInstructors} from '../service/instructorApi';
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchDashboardData,
  addStudent,
  addInstructor,
} from '../slice/dashboardSlice';
export default function AddInstructor({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    try {
      const InstructorData = {name: name, email: email, password: password};
      const result = await addInstructors(InstructorData);
      if (result) {
        navigation.goBack();
        dispatch(addInstructor(InstructorData));
      } else {
        alert('Failed to add student');
      }
    } catch (error) {
      console.error('Error submitting student data:', error);
      alert('An error occurred while submitting the data.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Instructor</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 16},
  heading: {fontSize: 24, textAlign: 'center', marginBottom: 16},
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});
