export interface Question {
  id: string;
  text: string;
  options?: Record<string, string> | string[]; // Backwards compatibility for old records and new arrays
  correctOption?: string; // Backwards compatibility
  correctAnswer?: string; // New simulation schema
  explanation: string;
  subtest: string;
  level: number;
  isWishlisted?: boolean;
  type?: 'normal' | 'quantity_comparison';
  quantityP?: string;
  quantityQ?: string;
  
  // Simulation Enhancements
  mode?: "latihan" | "simulasi";
  questionType?: "multiple_choice" | "thread" | "flowchart" | "table" | "short_answer";
  answerType?: "multiple_choice" | "short_answer";
  questionText?: string;
  passage?: string;
  metadata?: {
    threadItems?: {
      username: string;
      postedAt: string;
      content: string;
    }[];
    tableData?: {
      headers: string[];
      rows: { cells: string[] }[] | string[][];
    };
    flowchartItems?: {
      nodes: any[];
      edges: any[];
    };
  };
}

export interface QuestionPageProps {}
