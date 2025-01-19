import {createSelector} from '@reduxjs/toolkit';

export const selectInstructors = state => state.dashboard.instructors;

export const selectInstructorList = createSelector(
  [selectInstructors],
  instructors =>
    instructors.map(instructor => ({
      id: instructor.id,
      name: instructor.name,
    })),
);
