import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// Fetch all students
export const fetchStudents = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/addStudent`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export const fetchInstructors = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/addInstructor`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export const addStudent = async studentData => {
  try {
    const response = await axios.post(`${BASE_URL}/students`, studentData);
    return response.data;
  } catch (error) {
    console.error('Error adding student:', error);
    throw error;
  }
};
