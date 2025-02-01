import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {updateStudentPutApi, deleteLessonApi} from '../service/studentApi';
import {useSelector, useDispatch} from 'react-redux';
import {removeLesson} from '../slice/dashboardSlice';
export default function ({route, navigation}) {
  const {student} = route.params;
  const dispatch = useDispatch();
  const {students} = useSelector(state => state.dashboard);
  const [classesAttended, setClassesAttended] = useState('');
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState(student.email);
  const [lessons, setLessons] = useState([]);

  const maxLessons = 10;

  useEffect(() => {
    if (student && student.lessons) {
      const studentLessons = Object.values(student.lessons).map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        status: lesson.status || 'Yet to Start',
      }));
      setLessons(studentLessons);
    }
  }, []);

  const handleAddLesson = () => {
    if (lessons.length < maxLessons) {
      const newLesson = {
        id: lessons.length + 1,
        title: `Lesson ${lessons.length + 1}`,
        status: 'Yet to Start',
      };
      setLessons([...lessons, newLesson]);
    } else {
      Alert.alert(
        'Limit Reached',
        `You can only add up to ${maxLessons} lessons.`,
      );
    }
  };

  const handleDeleteLesson = (lessonId, lessonTitle) => {
    Alert.alert(
      'Delete Lesson',
      `Are you sure you want to delete Lesson ${lessonTitle}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteLessonApi(student.id, lessonId);
              setLessons(lessons.filter(lesson => lesson.id !== lessonId));
              dispatch(removeLesson({studentId: student.id, lessonId}));
              Alert.alert('Success', 'Lesson deleted successfully.');
            } catch (error) {
              console.error('Error deleting lesson:', error);
              Alert.alert('Error', 'Failed to delete the lesson.');
            }
          },
        },
      ],
    );
  };

  const handleLessonClick = lessonId => {
    const selectedLesson = lessons.find(lesson => lesson.id === lessonId);
    navigation.navigate('UpdateLessonPage', {
      lesson: selectedLesson,
      studentId: student.id,
      studentName: student.name,
    });
  };

  const handleUpdate = async studentId => {
    const payload = {
      email: email,
      classesAttended: classesAttended,
      feedback: feedback,
      lessons: lessons,
    };
    try {
      const resp = await updateStudentPutApi(studentId, payload);
      if (resp.data.success) {
        Alert.alert('Success', 'Details updated successfully!');
        navigation.goBack();
      } else {
        Alert.alert('Error', resp.data.message || 'Failed to update details.');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      Alert.alert(
        'Error',
        'An error occurred while updating the student details.',
      );
    }
  };

  const renderLessonItem = lesson => (
    <View
      key={lesson.id}
      style={[
        styles.lessonItem,
        lesson.status === 'Complete'
          ? styles.complete
          : lesson.status === 'In Progress'
          ? styles.inProgress
          : styles.yetToStart,
      ]}>
      <View style={styles.lessonContent}>
        <TouchableOpacity onPress={() => handleLessonClick(lesson.id)}>
          <Text style={styles.lessonText}>
            {lesson.title} - {lesson.status}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteLesson(lesson.id, lesson.title)}>
          <Text style={styles.deleteButtonText}>X</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Update Details for {student.name}</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email address"
      />
      <Text style={styles.label}>Selected Package: {student.packageType}</Text>
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
      <Text style={styles.label}>Lessons:</Text>
      <ScrollView style={styles.lessonsContainer}>
        {lessons.map(renderLessonItem)}
      </ScrollView>
      <View style={styles.fixedFooter}>
        {lessons.length < maxLessons && (
          <TouchableOpacity
            style={styles.addLessonButton}
            onPress={handleAddLesson}>
            <Text style={styles.addLessonText}>Add Lesson</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => handleUpdate(student.id)}>
          <Text style={styles.updateButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
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
  lessonsContainer: {flex: 1, marginBottom: 16},
  lessonItem: {
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  lessonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonText: {fontSize: 18, color: 'black'},
  deleteButton: {
    backgroundColor: 'red',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  deleteButtonText: {color: 'black', fontSize: 18},
  yetToStart: {backgroundColor: '#ffcccb'},
  inProgress: {backgroundColor: '#ffd700'},
  complete: {backgroundColor: '#90ee90'},
  fixedFooter: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addLessonButton: {
    backgroundColor: 'tomato',
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addLessonText: {color: 'black', fontSize: 18},
  updateButton: {
    backgroundColor: 'tomato',
    padding: 8,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButtonText: {color: 'black', fontSize: 18},
});
