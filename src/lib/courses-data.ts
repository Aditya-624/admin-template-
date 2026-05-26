export interface CourseType {
  id: number;
  name: string;
  shortForm: string;
  description: string;
  status: boolean;
}

export interface Course {
  id: number;
  name: string;
  courseTypeId: number;
  externals: number;
  description: string;
  status: boolean;
}

export const COURSE_TYPE_STORAGE_KEY = "masters-coursetype-list-v2";
export const COURSE_STORAGE_KEY = "masters-course-list-v2";

export const initialCourseTypes: CourseType[] = [];

export const initialCourses: Course[] = [];
