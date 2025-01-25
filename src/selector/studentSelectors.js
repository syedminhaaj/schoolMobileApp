import {createSelector} from '@reduxjs/toolkit';

export const selectStudents = state => state.dashboard.students;

export const selectStudentLessonList = createSelector(
  [selectStudents],
  student =>
    student.map(stud => ({
      id: stud.id,
      lessons: stud.lessons,
    })),
);
