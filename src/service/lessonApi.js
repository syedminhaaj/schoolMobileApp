import axios from 'axios';
import {BASE_URL} from './baseUrl';
//const BASE_URL = 'http://localhost:3000';

// Fetch all students
export const getLessons = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/addStudent/${id}/lessons`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export const updateLessonApi = async updatedData => {
  try {
    const response = await fetch(`${BASE_URL}/addStudent/lessons`, {
      method: 'POST',
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
