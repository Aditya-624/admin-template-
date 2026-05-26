export interface Branch {
  id: number;
  courseId: number;
  name: string;
  shortForm: string;
  description: string;
  status: boolean;
}

export const BRANCHES_STORAGE_KEY = "masters-branches-list-v1";

export const initialBranches: Branch[] = [];
