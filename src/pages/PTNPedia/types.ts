import { LucideIcon } from 'lucide-react';

export interface University {
  code: string;
  name: string;
  category: string;
}

export interface Program {
  code: string;
  name: string;
  jenjang: string;
  capacity: string;
  applicants: string;
  ratio: string;
  admissionChance: string;
  universityName?: string;
  universityCode?: string;
}

export interface KlasterTab {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface PTNPediaViewProps {
  onBack?: () => void;
}
