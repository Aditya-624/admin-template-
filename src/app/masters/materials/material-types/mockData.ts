export interface MaterialType {
  id: string;
  name: string;
  description: string;
  status: boolean;
}

export const mockMaterialTypes: MaterialType[] = [
  { id: "1", name: "Syllabus", description: "Subject syllabus documents.", status: true },
  { id: "2", name: "Course Material", description: "Lectures and course materials.", status: true },
  { id: "3", name: "Question Paper", description: "Previous year question papers.", status: true },
  { id: "4", name: "Key", description: "Answer keys and solutions.", status: true },
  { id: "5", name: "Scheme of Validation", description: "Evaluation and validation schemes.", status: true },
  { id: "6", name: "Answer Sheet", description: "Sample student answer sheets.", status: true },
];
