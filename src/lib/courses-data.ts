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

export const initialCourseTypes: CourseType[] = [
  { id: 1, name: "Secondary", shortForm: "SS", description: "School Secondary (9th, 10th Class)", status: true },
  { id: 2, name: "Higher Education", shortForm: "HE", description: "Intermediate", status: true },
  { id: 3, name: "Under Graduate", shortForm: "UG", description: "Graduation", status: true },
  { id: 4, name: "Post Graduate", shortForm: "PG", description: "Post Graduation", status: true },
];

export const initialCourses: Course[] = [
  {
    id: 1,
    name: "B. Tech.",
    courseTypeId: 3,
    externals: 2,
    description: "",
    status: true,
  },
  {
    id: 2,
    name: "B. Pharm.",
    courseTypeId: 3,
    externals: 2,
    description: "",
    status: true,
  },
  {
    id: 3,
    name: "BBA",
    courseTypeId: 3,
    externals: 2,
    description: "",
    status: true,
  },
  {
    id: 4,
    name: "M. Tech.",
    courseTypeId: 4,
    externals: 2,
    description: "",
    status: true,
  },
  {
    id: 5,
    name: "MBA",
    courseTypeId: 4,
    externals: 3,
    description: "",
    status: true,
  },
];
