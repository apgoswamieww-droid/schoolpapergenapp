export type UserRole = 'TEACHER' | 'STUDENT';

export type AuthSession = {
  token: string;
  user: {
    id?: string | number;
    email?: string;
    role: UserRole;
    schoolId: string | number;
  };
};
