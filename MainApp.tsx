import React, {useState, createRef} from 'react';
import {View, Text, TouchableOpacity, Modal, StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {Provider, useSelector, useDispatch} from 'react-redux';
import store from './src/store/store';
import {login, logout} from './src/slice/dashboardSlice';
import LoginPage from './src/screens/LoginPage';
import DashboardPage from './src/screens/DashboardPage';
import AddInstructor from './src/screens/AddInstructor';
import AddStudent from './src/screens/AddStudent';
import StudentUpdatePage from './src/screens/StudentUpdate';
import InstructorUpdatePage from './src/screens/InstructorUpdatePage';
import UpdateLessonPage from './src/screens/UpdateLessonPage';

const navigationRef = createRef();

function MainApp(): React.JSX.Element {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const DashboardStack = () => (
    <Stack.Navigator>
      <Stack.Screen name="DashboardPage" component={DashboardPage} />
      <Stack.Screen name="AddInstructor" component={AddInstructor} />
      <Stack.Screen name="AddStudent" component={AddStudent} />
      <Stack.Screen name="StudentUpdatePage" component={StudentUpdatePage} />
      <Stack.Screen name="UpdateLessonPage" component={UpdateLessonPage} />

      <Stack.Screen
        name="InstructorUpdatePage"
        component={InstructorUpdatePage}
      />
    </Stack.Navigator>
  );

  const TabNavigator = () => {
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const isAuthenticated = useSelector(
      state => state.dashboard.isAuthenticated,
    );

    const openModal = () => {
      setModalVisible(true);
    };

    const closeModal = () => {
      setModalVisible(false);
    };

    const confirmLogout = () => {
      setLogoutModalVisible(true);
    };

    const handleLogout = () => {
      setLogoutModalVisible(false);
      dispatch(logout());
    };

    return (
      <>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Add') {
                iconName = focused ? 'add-circle' : 'add-circle-outline';
              } else if (route.name === 'Logout') {
                iconName = focused ? 'log-out' : 'log-out-outline';
              }
              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
          })}>
          <Tab.Screen name="Home" component={DashboardStack} />
          <Tab.Screen
            name="Add"
            component={() => null}
            listeners={{
              tabPress: e => {
                e.preventDefault();
                openModal();
              },
            }}
          />
          {isAuthenticated && (
            <Tab.Screen
              name="Logout"
              component={() => null}
              listeners={{
                tabPress: e => {
                  e.preventDefault();
                  confirmLogout();
                },
              }}
            />
          )}
        </Tab.Navigator>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>What would you like to add?</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  closeModal();
                  navigationRef.current?.navigate('AddStudent');
                }}>
                <Text style={styles.modalButtonText}>Add Student</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  closeModal();
                  navigationRef.current?.navigate('AddInstructor');
                }}>
                <Text style={styles.modalButtonText}>Add Instructor</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={logoutModalVisible}
          onRequestClose={() => setLogoutModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Are you sure you want to logout?
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleLogout}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setLogoutModalVisible(false)}>
                <Text style={styles.cancelButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </>
    );
  };

  const MainNavigator = () => {
    const isAuthenticated = useSelector(
      state => state.dashboard.isAuthenticated,
    );
    return isAuthenticated ? <TabNavigator /> : <LoginPage />;
  };

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <MainNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    width: '100%',
    padding: 15,
    backgroundColor: 'tomato',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'gray',
    fontSize: 16,
  },
});

export default MainApp;
