export interface StudyNote {
  id: number;
  content: string;
  question: string;
}

export const studyNotes: StudyNote[] = [
  {
    id: 1,
    content:
      'Photosynthesis allows plants to convert sunlight into energy-rich molecules using water and carbon dioxide.',
    question: 'What do plants produce during photosynthesis?'
  },
  {
    id: 2,
    content:
      'Mitochondria are organelles that generate ATP, the main energy currency of the cell.',
    question: 'Which organelle is responsible for making ATP in most cells?'
  },
  {
    id: 3,
    content:
      'DNA is composed of nucleotides arranged in a double helix. It carries genetic information.',
    question: 'What molecule stores genetic information in cells?'
  }
];
