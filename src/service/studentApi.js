import axios from 'axios';

const BASE_URL = 'http://localhost:3000/addStudent';

// Fetch all students
export const fetchStudents = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export const addStudentApi = async studentData => {
  try {
    const response = await axios.post(`${BASE_URL}`, studentData);
    return response.data;
  } catch (error) {
    console.error('Error adding student:', error);
    throw error;
  }
};

export const updateStudentPutApi = async (id, updatedData) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    return response.json();
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};
export const deleteLessonApi = async (studentId, lessonId) => {
  const payload = {studentId, lessonId};
  return await axios.delete(`${BASE_URL}/lessons`, {
    data: payload,
  });
};
