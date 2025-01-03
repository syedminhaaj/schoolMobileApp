import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, Button} from 'react-native';
import {StatusBar} from 'react-native';
export default function DashboardPage({route, navigation}) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (route.params?.newStudent) {
      setStudents(prev => [...prev, route.params.newStudent]);
    }
  }, [route.params?.newStudent]);

  const renderItem = ({item, index}) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.name}</Text>
      <Text style={styles.tableCell}>{item.email}</Text>
      <Text style={styles.tableCell}>{item.packageType}</Text>
      <Button
        title="Update"
        onPress={() =>
          navigation.navigate('StudentUpdatePage', {student: item})
        }
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Student List</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderCell}>Name</Text>
        <Text style={styles.tableHeaderCell}>Email</Text>
        <Text style={styles.tableHeaderCell}>Package</Text>
      </View>
      <View>
        <FlatList
          data={students}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      </View>

      <View style={styles.container}>
        <Button
          title="Add Instructor"
          onPress={() => navigation.navigate('AddInstructor')}
        />
        <Button
          title="Add Student"
          onPress={() => navigation.navigate('AddStudent')}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  heading: {fontSize: 24, textAlign: 'center', marginBottom: 16},
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
