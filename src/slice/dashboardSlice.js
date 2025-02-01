import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {fetchStudents} from '../service/studentApi';
import {fetchInstructors} from '../service/instructorApi';

// Async Thunks for fetching data
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async () => {
    const students = await fetchStudents();
    const instructors = await fetchInstructors();
    return {students, instructors};
  },
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    students: [],
    instructors: [],
    loading: false,
    isAuthenticated: false,
    error: null,
  },
  reducers: {
    setInstructors(state, action) {
      state.instructors = action.payload;
    },
    addStudent(state, action) {
      state.students.push(action.payload);
    },
    updateStudent(state, action) {
      const index = state.students.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.students[index] = action.payload;
      }
    },
    addInstructor(state, action) {
      state.instructors.push(action.payload);
    },
    updateInstructor(state, action) {
      const index = state.instructors.findIndex(
        i => i.id === action.payload.id,
      );
      if (index !== -1) {
        state.instructors[index] = action.payload;
      }
    },

    updateLesson(state, action) {
      const {studentId, lessonTitle, attributes} = action.payload;

      // Find the student by ID
      const studentIndex = state.students.findIndex(
        student => student.id === studentId,
      );

      if (studentIndex !== -1) {
        let lessons = state.students[studentIndex].lessons || {};

        // Find the existing lesson by title
        const lessonKey = Object.keys(lessons).find(
          key => lessons[key]?.title === lessonTitle,
        );

        if (lessonKey) {
          // Update existing lesson attributes immutably
          console.log('if condition', lessonKey);
          lessons = {
            ...lessons,
            [lessonKey]: {
              ...lessons[lessonKey],
              ...action.payload,
            },
          };
        } else {
          // Assign a new key and add the new lesson if it doesn't exist
          const newLesson = action.payload;
          console.log('action payload from slice reducer', action.payload);
          lessons = {
            ...lessons,
            [newLesson.lessonId]: {
              lessonId: newLesson.lessonId,
              lessonTitle: newLesson.lessonTitle,
              attributes: newLesson.attributes,
            },
          };
        }
        // Update the student lessons
        state.students[studentIndex].lessons = lessons;
      }
    },
    removeLesson(state, action) {
      const {studentId, lessonId} = action.payload;

      const studentIndex = state.students.findIndex(
        student => student.id === studentId,
      );

      if (studentIndex !== -1) {
        const lessons = state.students[studentIndex].lessons || {};
        const updatedLessons = {...lessons};

        // Remove the lesson by key
        for (const key in updatedLessons) {
          if (updatedLessons[key]?.id === lessonId) {
            delete updatedLessons[key];
            break;
          }
        }

        state.students[studentIndex].lessons = updatedLessons;
      }
    },
    login(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDashboardData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload.students;
        state.instructors = action.payload.instructors;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  addStudent,
  updateStudent,
  addInstructor,
  updateInstructor,
  setInstructors,
  updateLesson,
  removeLesson,
  login,
  logout,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
