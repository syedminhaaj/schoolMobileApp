import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
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

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // Handle new student or instructor addition
  useEffect(() => {
    if (route.params?.newStudent) {
      dispatch(addStudent(route.params.newStudent));
    }
    if (route.params?.newInstructor) {
      dispatch(addInstructor(route.params.newInstructor));
    }
  }, [route.params, dispatch]);

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
      {/* Student List Section */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionHeading}>Student List</Text>

        {/* Table Header for Students */}
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Name</Text>
          <Text style={styles.tableHeaderCell}>Email</Text>
          <Text style={styles.tableHeaderCell}>Package</Text>
        </View>

        <FlatList
          data={students}
          keyExtractor={item => item.id} // Use student ID as a key
          renderItem={renderStudentItem}
        />
      </View>

      {/* Instructor List Section */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionHeading}>Instructor List</Text>

        {/* Table Header for Instructors */}
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Name</Text>
          <Text style={styles.tableHeaderCell}>Email</Text>
          <Text style={styles.tableHeaderCell}>Subject</Text>
        </View>

        <FlatList
          data={instructors}
          keyExtractor={item => item.id} // Use instructor ID as a key
          renderItem={renderInstructorItem}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  heading: {fontSize: 24, textAlign: 'center', marginBottom: 16},
  listContainer: {
    flex: 1,
    margin: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 8,
    height: '50%', // Half height for each list
  },
  sectionHeading: {fontSize: 20, fontWeight: 'bold', marginBottom: 8},
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    padding: 8,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 8,
  },
  tableCell: {flex: 1, textAlign: 'center'},
});
