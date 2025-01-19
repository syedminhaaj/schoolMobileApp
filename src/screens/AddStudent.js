import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Switch} from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import {addStudentApi} from '../service/studentApi';
import {useDispatch, useSelector} from 'react-redux';
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
    // Map instructorsList to the format required by ModalSelector
    const formattedData = instructorsList.map(instructor => ({
      key: instructor.id,
      label: instructor.name,
    }));
    setInstructors(formattedData);
  }, [instructorsList]);
  // useEffect(() => {
  //   // Fetch the list of instructors when the component mounts
  //   const loadInstructors = async () => {
  //     try {
  //       //const data = await fetchInstructors();
  //       const formattedData = instructorsList.map((instructor, index) => ({
  //         key: instructor.id,
  //         label: instructor.name,
  //       }));
  //       setInstructors(formattedData);
  //     } catch (error) {
  //       console.error('Error fetching instructors:', error);
  //     }
  //   };
  //   loadInstructors();
  // }, []);
  const handleSubmit = async () => {
    console.log({name, email, licenseNumber, roadTestDate});
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
    <View style={styles.container}>
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
            {'Choose your License Exam: ' + selectLicense ||
              'Select your license exam'}
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
            initValue=""
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
