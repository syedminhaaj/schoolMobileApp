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
import {useSelector, useDispatch} from 'react-redux';
export default function ({route, navigation}) {
  const {student} = route.params;

  const [classesAttended, setClassesAttended] = useState('');
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState(student.email);
  const [lessons, setLessons] = useState([]);

  const maxLessons = 10; // Maximum number of lessons allowed
  const {students} = useSelector(state => state.dashboard);

  useEffect(() => {
    console.log('students-----', students);
    const initialLesson = {
      id: 1,
      title: `Lesson 1`,
      status: 'Yet to Start',
    };
    setLessons([initialLesson]);
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

  const handleLessonClick = lessonId => {
    // setLessons(prevLessons =>
    //   prevLessons.map(lesson =>
    //     lesson.id === lessonId
    //       ? {
    //           ...lesson,
    //           status:
    //             lesson.status === 'Yet to Start'
    //               ? 'In Progress'
    //               : lesson.status === 'In Progress'
    //               ? 'Complete'
    //               : 'Yet to Start',
    //         }
    //       : lesson,
    //   ),
    // );

    const selectedLesson = lessons.find(lesson => lesson.id === lessonId);
    navigation.navigate('UpdateLessonPage', {
      lesson: selectedLesson,
      studentId: student.id,
    });
  };

  const handleUpdate = () => {
    Alert.alert('Success', 'Details updated successfully!');
    navigation.goBack();
  };

  const renderLessonItem = lesson => (
    <TouchableOpacity
      key={lesson.id}
      style={[
        styles.lessonItem,
        lesson.status === 'Complete'
          ? styles.complete
          : lesson.status === 'In Progress'
          ? styles.inProgress
          : styles.yetToStart,
      ]}
      onPress={() => handleLessonClick(lesson.id)}>
      <Text style={styles.lessonText}>
        {lesson.title} - {lesson.status}
      </Text>
    </TouchableOpacity>
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
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  lessonsContainer: {
    flex: 1,
    marginBottom: 16,
  },
  lessonItem: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 4,
  },
  lessonText: {
    fontSize: 16,
    color: '#fff',
  },
  yetToStart: {
    backgroundColor: '#ffcccb', // Red for "Yet to Start"
  },
  inProgress: {
    backgroundColor: '#ffd700', // Yellow for "In Progress"
  },
  complete: {
    backgroundColor: '#90ee90', // Green for "Complete"
  },
  fixedFooter: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  addLessonButton: {
    backgroundColor: 'tomato',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  addLessonText: {
    color: 'white',
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: 'tomato',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
