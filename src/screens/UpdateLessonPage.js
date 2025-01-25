import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {updateLesson} from '../service/lessonApi';

export default function UpdateLessonPage({route, navigation}) {
  const {lesson, studentId} = route.params;

  const [attributes, setAttributes] = useState({
    parallelParking: false,
    reverseParking: false,
    laneChange: false,
    threePointTurn: false,
    leftTurn: false,
    speed: false,
  });

  useEffect(() => {
    console.log('Student ID:', studentId);
  }, []);

  const handleCheckboxChange = key => {
    setAttributes(prev => ({...prev, [key]: !prev[key]}));
  };

  const handleSave = async () => {
    const updatedData = {
      lessonTitle: lesson.title,
      attributes,
    };

    try {
      const response = await updateLesson(studentId, updatedData);

      if (response.success) {
        Alert.alert('Success', 'The lesson details have been updated.');
        navigation.goBack();
      } else {
        Alert.alert('Error', response.message || 'Failed to update lesson.');
      }
    } catch (error) {
      console.error('Error updating lesson:', error);
      Alert.alert('Error', 'An error occurred while updating the lesson.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>{lesson.title} - Update Details</Text>
      {Object.keys(attributes).map(key => (
        <View style={styles.checkboxContainer} key={key}>
          <CheckBox
            value={attributes[key]}
            onValueChange={() => handleCheckboxChange(key)}
          />
          <Text style={styles.checkboxLabel}>
            {key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase())}
          </Text>
        </View>
      ))}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: 'tomato',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
