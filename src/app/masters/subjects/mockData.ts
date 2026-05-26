export interface Subject {
  id: string;
  courseId: string;
  courseName: string;
  branchId: string;
  branchName: string;
  year: string;
  semester: string;
  name: string;
  shortForm: string;
  chaptersCount: number;
  internalMarks: number;
  internalPassMark: number;
  externalMarks: number;
  externalPassMark: number;
  description: string;
  status: boolean;
}

export const mockSubjects: Subject[] = [
  {
    id: "1",
    courseId: "1",
    courseName: "B. Tech.",
    branchId: "5",
    branchName: "CSE",
    year: "1st Year",
    semester: "1",
    name: "C Language",
    shortForm: "C",
    chaptersCount: 10,
    internalMarks: 40,
    internalPassMark: 23,
    externalMarks: 60,
    externalPassMark: 37,
    description: "Fundamental C programming language concepts.",
    status: true,
  },
  {
    id: "2",
    courseId: "1",
    courseName: "B. Tech.",
    branchId: "5",
    branchName: "CSE",
    year: "1st Year",
    semester: "1",
    name: "Software Engineering",
    shortForm: "SE",
    chaptersCount: 12,
    internalMarks: 40,
    internalPassMark: 23,
    externalMarks: 60,
    externalPassMark: 37,
    description: "Basic principles of software engineering.",
    status: true,
  },
  {
    id: "3",
    courseId: "1",
    courseName: "B. Tech.",
    branchId: "1",
    branchName: "ECE",
    year: "1st Year",
    semester: "2",
    name: "Computer Networks",
    shortForm: "CN",
    chaptersCount: 10,
    internalMarks: 40,
    internalPassMark: 23,
    externalMarks: 60,
    externalPassMark: 37,
    description: "Introduction to computer networking concepts.",
    status: true,
  },
  {
    id: "4",
    courseId: "1",
    courseName: "B. Tech.",
    branchId: "1",
    branchName: "ECE",
    year: "2nd Year",
    semester: "1",
    name: "Data Science",
    shortForm: "DS",
    chaptersCount: 10,
    internalMarks: 40,
    internalPassMark: 23,
    externalMarks: 60,
    externalPassMark: 37,
    description: "Foundations of data science and analysis.",
    status: true,
  },
];
