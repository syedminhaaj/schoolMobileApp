import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet} from 'react-native';
import {updateInstructor} from '../service/instructorApi'; // API function to update instructor

export default function InstructorUpdatePage({route, navigation}) {
  const {instructor} = route.params;

  const [name, setName] = useState(instructor.name);
  const [email, setEmail] = useState(instructor.email);

  const handleUpdate = async () => {
    const updatedInstructor = {...instructor, name, email};
    try {
      await updateInstructor(updatedInstructor);
      alert('Instructor updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating instructor:', error);
      alert('Failed to update instructor.');
    }
  };

  return (
    <View style={styles.container}>
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
      <Button title="Update" onPress={handleUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 16},
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});
