export type PTNInsightDataset = {
  metadata: {
    dataset_name: string;
    country: string;
    institution_type: string;
    language: string;
    version: string;
    generated_at: string;
    data_status: string;
    total_universities?: number;
    notes?: string[];
  };
  universities: PTNUniversity[];
  excluded_or_uncertain?: unknown[];
};

export type PTNUniversity = {
  id: string;
  name: string;
  short_name: string;
  type: "universitas" | "institut" | string;
  category: string;
  location: {
    city: string | null;
    province: string | null;
    main_campus_address: string | null;
    region: string | null;
  };
  official_website: string | null;
  last_verified_at: string | null;
  ringkasan_kampus: {
    short_description: string | null;
    academic_focus: string[];
    suitable_for: string[];
    key_highlights: string[];
  };
  fakta_terkini: Array<{
    title: string;
    description: string;
    date_or_year: string | null;
    source_url: string | null;
  }>;
  prospek_kerja: Array<{
    career_field: string;
    description: string;
    related_faculties_or_majors: string[];
    example_roles: string[];
  }>;
  lingkungan_kampus: {
    summary: string | null;
    campus_life_tags: string[];
    student_activities: string[];
    surrounding_environment: string | null;
    transportation_access: string | null;
  };
  alumni: Array<{
    name: string;
    known_as: string;
    faculty_or_major: string | null;
    verification_source_url: string | null;
  }>;
  jalur_masuk: Array<{
    name: string;
    type: string;
    description: string;
    official_url: string | null;
  }>;
  ciri_khas: Array<{
    title: string;
    description: string;
    evidence_source_url: string | null;
  }>;
  sumber_data: Array<{
    label: string;
    url: string | null;
    type: string;
    accessed_at: string | null;
  }>;
  data_quality: {
    completeness_score: number;
    confidence_level: "high" | "medium" | "low" | string;
    missing_fields: string[];
    verification_notes: string | null;
  };
};
