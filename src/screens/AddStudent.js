import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Switch,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {addStudentApi} from '../service/studentApi';
import {addStudent} from '../slice/dashboardSlice';
import {selectInstructorList} from '../selector/instructorSelector';

const licenseData = [
  {key: 'g2', label: 'G2 License'},
  {key: 'G', label: 'G License'},
];

const packageData = [
  {key: 'gold', label: 'Gold'},
  {key: 'silver', label: 'Silver'},
];

export default function AddStudent({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [packageType, setPackageType] = useState('Bronze');
  const [hasRoadTest, setHasRoadTest] = useState(false);
  const [roadTestDate, setRoadTestDate] = useState('');
  const [selectLicense, setSelectLicense] = useState('');
  const [selectPackage, setSelectPackage] = useState('');
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const dispatch = useDispatch();

  const instructorsList = useSelector(selectInstructorList);

  useEffect(() => {
    const formattedData = instructorsList.map(instructor => ({
      key: `${instructor.id}`,
      label: instructor.name,
    }));
    setInstructors(formattedData);
  }, [instructorsList]);

  const handleSubmit = async () => {
    const studentData = {
      name,
      email,
      licenseNumber,
      licenseExam: selectLicense,
      packageType: selectPackage,
      roadTestDate: hasRoadTest ? roadTestDate : 'N/A',
      instructorId: selectedInstructor,
    };

    try {
      const result = await addStudentApi(studentData);
      if (result) {
        navigation.navigate('DashboardPage');
        dispatch(addStudent(studentData));
      } else {
        alert('Failed to add student');
      }
    } catch (error) {
      console.error('Error submitting student data:', error);
      alert('An error occurred while submitting the data.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        extraScrollHeight={20}
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === 'ios'}>
        <Text style={styles.heading}>Add Student</Text>

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
          placeholder="License Number"
          value={licenseNumber}
          onChangeText={setLicenseNumber}
        />

        <View style={{padding: 16}}>
          <ModalSelector
            data={licenseData}
            initValue=""
            onChange={option => setSelectLicense(option.label)}>
            <Text style={{color: selectLicense ? 'black' : 'gray'}}>
              {'Choose your License Exam: ' + selectLicense}
            </Text>
          </ModalSelector>
        </View>

        <View style={{padding: 16}}>
          <ModalSelector
            data={packageData}
            initValue=""
            onChange={option => setSelectPackage(option.label)}>
            <Text style={{color: selectPackage ? 'black' : 'gray'}}>
              {'Select your package: ' + selectPackage}
            </Text>
          </ModalSelector>
        </View>

        {instructors.length > 0 && (
          <View style={{padding: 16}}>
            <ModalSelector
              data={instructors}
              initValue="Select an instructor"
              onChange={option => setSelectedInstructor(option.key)}>
              <Text style={{color: selectedInstructor ? 'black' : 'gray'}}>
                {selectedInstructor
                  ? `Instructor: ${
                      instructors.find(
                        instructor => instructor.key === selectedInstructor,
                      )?.label
                    }`
                  : 'Select an instructor'}
              </Text>
            </ModalSelector>
          </View>
        )}

        <View style={styles.switchContainer}>
          <Text>Has Road Test:</Text>
          <Switch value={hasRoadTest} onValueChange={setHasRoadTest} />
        </View>

        <TextInput
          style={[styles.input, !hasRoadTest && styles.disabledInput]}
          placeholder="Road Test Date"
          value={roadTestDate}
          onChangeText={setRoadTestDate}
          editable={hasRoadTest}
        />

        <Button title="Submit" onPress={handleSubmit} />
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {padding: 16, flexGrow: 1},
  heading: {fontSize: 24, textAlign: 'center', marginBottom: 16},
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#aaa',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
});
