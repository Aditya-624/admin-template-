export interface MaterialMeta1 {
  id: number;
  courseId: string;
  courseName: string;
  branchId: string;
  branchName: string;
  subjectId: string;
  subjectName: string;
  subjectShortForm: string;
  materialTypeId: string;
  materialTypeName: string;
  year: string;
  semester: string;
  chaptersCount: number;
  description: string;
  status: boolean;
}

export const mockMaterialMeta1Records: MaterialMeta1[] = [
  {
    id: 1,
    courseId: "1",
    courseName: "B. Tech.",
    branchId: "5",
    branchName: "CSE",
    subjectId: "1",
    subjectName: "C Language",
    subjectShortForm: "C",
    materialTypeId: "3",
    materialTypeName: "Question Paper",
    year: "1st Year",
    semester: "1",
    chaptersCount: 5,
    description: "Previous year question papers for C Language.",
    status: true,
  },
  {
    id: 2,
    courseId: "1",
    courseName: "B. Tech.",
    branchId: "5",
    branchName: "CSE",
    subjectId: "2",
    subjectName: "Software Engineering",
    subjectShortForm: "SE",
    materialTypeId: "4",
    materialTypeName: "Key",
    year: "1st Year",
    semester: "1",
    chaptersCount: 5,
    description: "Answer keys and solutions for Software Engineering.",
    status: true,
  },
  {
    id: 3,
    courseId: "1",
    courseName: "B. Tech.",
    branchId: "1",
    branchName: "ECE",
    subjectId: "3",
    subjectName: "Computer Networks",
    subjectShortForm: "CN",
    materialTypeId: "5",
    materialTypeName: "Scheme of Validation",
    year: "1st Year",
    semester: "2",
    chaptersCount: 6,
    description: "Scheme of validation for Computer Networks evaluation.",
    status: true,
  },
  {
    id: 4,
    courseId: "1",
    courseName: "B. Tech.",
    branchId: "1",
    branchName: "ECE",
    subjectId: "4",
    subjectName: "Data Science",
    subjectShortForm: "DS",
    materialTypeId: "6",
    materialTypeName: "Answer Sheet",
    year: "2nd Year",
    semester: "1",
    chaptersCount: 4,
    description: "Sample student answer sheets for Data Science course.",
    status: true,
  },
];
