export interface UserProfile {
  displayName?: string;
  photoBase64?: string;
  dreamUniversity?: string;
  dreamMajor?: string;
  reason?: string;
  uid?: string;
}

export interface Session {
  id: string;
  subtest: string;
  level: number;
  isFinished: boolean;
  createdAt?: {
    toDate: () => Date;
  };
}

export interface OverviewProps {
  profile: UserProfile | null;
}
