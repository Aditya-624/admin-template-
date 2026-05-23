export interface Branch {
  id: number;
  courseId: number;
  name: string;
  shortForm: string;
  description: string;
  status: boolean;
}

export const BRANCHES_STORAGE_KEY = "masters-branches-list-v1";

export const initialBranches: Branch[] = [
  {
    id: 1,
    courseId: 1, // B. Tech.
    name: "Civil",
    shortForm: "CVL",
    description: "",
    status: true,
  },
  {
    id: 2,
    courseId: 2, // B. Pharm.
    name: "EEE",
    shortForm: "EEE",
    description: "",
    status: true,
  },
  {
    id: 3,
    courseId: 3, // BBA
    name: "Mechanical",
    shortForm: "MECH",
    description: "",
    status: true,
  },
  {
    id: 4,
    courseId: 4, // M. Tech.
    name: "ECE",
    shortForm: "ECE",
    description: "",
    status: true,
  },
  {
    id: 5,
    courseId: 5, // MBA
    name: "CSE",
    shortForm: "CSE",
    description: "",
    status: true,
  },
];
