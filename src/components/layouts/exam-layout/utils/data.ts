export const examTab = {
  LISTENING: {
    PART_1: "LISTENING_PART_1",
    PART_2: "LISTENING_PART_2",
    PART_3: "LISTENING_PART_3",
  },
  READING: {
    PART_1: "READING_PART_1",
    PART_2: "READING_PART_2",
    PART_3: "READING_PART_3",
    PART_4: "READING_PART_4",
  },
  WRITING: {
    PART_1: "WRITING_PART_1",
    PART_2: "WRITING_PART_2",
  },
  SPEAKING: { PART_1: "SPEAKING_PART_1" },
};

export const examSections = [
  "listening",
  "reading",
  "writing",
  "speaking",
] as const;
