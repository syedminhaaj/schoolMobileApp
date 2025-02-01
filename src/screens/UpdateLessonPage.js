import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import {updateLessonApi} from '../service/lessonApi';
import {updateLesson} from '../slice/dashboardSlice';

export default function UpdateLessonPage({route, navigation}) {
  const dispatch = useDispatch();
  const {students} = useSelector(state => state.dashboard);
  const {lesson, studentId, studentName} = route.params;

  // Find the current student
  const currentStudent = students.find(stud => stud.id === studentId);

  // Find the specific lesson by title
  const lessons = currentStudent?.lessons || {};

  const currentLessonKey = Object.keys(lessons).find(
    key => lessons[key]?.title?.toLowerCase() === lesson?.title?.toLowerCase(),
  );
  const currentLesson = currentLessonKey ? lessons[currentLessonKey] : null;

  // Initialize attributes with the lesson details or default values
  const [attributes, setAttributes] = useState(
    currentLesson?.attributes || {
      parallelParking: false,
      reverseParking: false,
      laneChange: false,
      threePointTurn: false,
      leftTurn: false,
      speed: false,
    },
  );

  useEffect(() => {}, [currentStudent, currentLesson]);

  const handleCheckboxChange = key => {
    setAttributes(prev => ({...prev, [key]: !prev[key]}));
  };

  const handleSave = async () => {
    const updatedData = {
      studentId: studentId,
      lessonTitle: lesson.title,
      lessonId: currentLesson?.id,
      attributes,
    };

    try {
      const response = await updateLessonApi(updatedData);

      if (response.success) {
        Alert.alert('Success', 'The lesson details have been updated');
        console.log('response after lesson add', response);
        console.log('currentLesson *****', currentLesson);
        dispatch(
          updateLesson({
            studentId: studentId,
            lessonTitle: response.lesson.title,
            lessonId: response.lessonId,
            attributes,
          }),
        );
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
      <Text style={styles.heading}>
        {studentName} - {lesson?.title}
      </Text>
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
    color: 'black',
    fontSize: 18,
  },
});
