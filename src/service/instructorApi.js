import axios from 'axios';
import {BASE_URL} from './baseUrl';

//const BASE_URL = 'http://localhost:3000';

export const fetchInstructors = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/instructor`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching instructor:', error);
    throw error;
  }
};

export const addInstructors = async InstructorData => {
  const response = await fetch(`${BASE_URL}/instructor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(InstructorData),
  });

  return response.json();
};

export const updateInstructor = async (id, updatedData) => {
  try {
    const response = await fetch(`${BASE_URL}/instructor/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    return response.json();
  } catch (error) {
    console.error('Error updating instructor:', error);
    throw error;
  }
};
