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
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
