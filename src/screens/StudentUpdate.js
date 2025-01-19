import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, Button, Alert} from 'react-native';

export default function ({route, navigation}) {
  const {student} = route.params;
  const [classesAttended, setClassesAttended] = useState('');
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState(student.email);

  const handleUpdate = () => {
    Alert.alert('Success', 'Details updated successfully!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Update Details for {student.name}</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email address"
      />
      <Text style={styles.label}>Classes Attended:</Text>
      <TextInput
        style={styles.input}
        value={classesAttended}
        onChangeText={setClassesAttended}
        placeholder="Enter classes attended"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Feedback:</Text>
      <TextInput
        style={styles.input}
        value={feedback}
        onChangeText={setFeedback}
        placeholder="Enter feedback"
        multiline
      />
      <Button title="Update" onPress={handleUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  heading: {fontSize: 24, marginBottom: 16, textAlign: 'center'},
  label: {fontSize: 16, marginVertical: 8},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
});
