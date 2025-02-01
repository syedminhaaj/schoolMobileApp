
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchDashboardData,
  addStudent,
  addInstructor,
} from '../slice/dashboardSlice';

export default function DashboardPage({route, navigation}) {
  const dispatch = useDispatch();
  const {students, instructors, loading, error} = useSelector(
    state => state.dashboard,
  );

  const [searchText, setSearchText] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // Sync filtered lists with the search text
  useEffect(() => {
    if (route.params?.newStudent) {
      dispatch(addStudent(route.params.newStudent));
    }
    if (route.params?.newInstructor) {
      dispatch(addInstructor(route.params.newInstructor));
    }
  }, [route.params, dispatch]);

  useEffect(() => {
    filterData(searchText);
  }, [students, instructors, searchText]);

  const filterData = text => {
    const lowercasedText = text.toLowerCase();

    setFilteredStudents(
      students.filter(
        student =>
          student.name?.toLowerCase().includes(lowercasedText) ||
          student.email?.toLowerCase().includes(lowercasedText) ||
          student.packageType?.toLowerCase().includes(lowercasedText),
      ),
    );

    setFilteredInstructors(
      instructors.filter(
        instructor =>
          instructor.name?.toLowerCase().includes(lowercasedText) ||
          instructor.email?.toLowerCase().includes(lowercasedText) ||
          instructor.subject?.toLowerCase().includes(lowercasedText),
      ),
    );
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const renderStudentItem = ({item}) => (
    <TouchableOpacity
      style={styles.tableRow}
      onPress={() => navigation.navigate('StudentUpdatePage', {student: item})}>
      <Text style={styles.tableCell} numberOfLines={1} ellipsizeMode="tail">
        {item.name}
      </Text>
      <Text style={styles.tableCell} numberOfLines={1} ellipsizeMode="tail">
        {item.email}
      </Text>
      <Text style={styles.tableCell}>{item.packageType}</Text>
    </TouchableOpacity>
  );

  const renderInstructorItem = ({item}) => (
    <TouchableOpacity
      style={styles.tableRow}
      onPress={() =>
        navigation.navigate('InstructorUpdatePage', {instructor: item})
      }>
      <Text style={styles.tableCell} numberOfLines={1} ellipsizeMode="tail">
        {item.name}
      </Text>
      <Text style={styles.tableCell} numberOfLines={1} ellipsizeMode="tail">
        {item.email}
      </Text>
      <Text style={styles.tableCell}>{item.subject}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name, email, license, package etc"
        value={searchText}
        onChangeText={text => setSearchText(text)}
      />

      <View style={styles.listContainer}>
        <Text style={styles.sectionHeading}>Student List</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Name</Text>
          <Text style={styles.tableHeaderCell}>Email</Text>
          <Text style={styles.tableHeaderCell}>Package</Text>
        </View>
        <FlatList
          data={filteredStudents}
          keyExtractor={item => item.id}
          renderItem={renderStudentItem}
        />
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.sectionHeading}>Instructor List</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Name</Text>
          <Text style={styles.tableHeaderCell}>Email</Text>
          <Text style={styles.tableHeaderCell}>Subject</Text>
        </View>
        <FlatList
          data={filteredInstructors}
          keyExtractor={item => item.id}
          renderItem={renderInstructorItem}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  listContainer: {
    flex: 1,
    margin: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 8,
  },
  sectionHeading: {fontSize: 20, fontWeight: 'bold', marginBottom: 8},
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    padding: 8,
  },
  tableHeaderCell: {flex: 1, fontWeight: 'bold', textAlign: 'center'},
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 8,
  },
  tableCell: {flex: 1, textAlign: 'center'},
});
