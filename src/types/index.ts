export enum BloodType {
  A_POSITIVE = 'A_POSITIVE',
  A_NEGATIVE = 'A_NEGATIVE',
  B_POSITIVE = 'B_POSITIVE',
  B_NEGATIVE = 'B_NEGATIVE',
  AB_POSITIVE = 'AB_POSITIVE',
  AB_NEGATIVE = 'AB_NEGATIVE',
  O_POSITIVE = 'O_POSITIVE',
  O_NEGATIVE = 'O_NEGATIVE',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum DonationStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum NotificationType {
  ELIGIBLE_TO_DONATE = 'ELIGIBLE_TO_DONATE',
  DONATION_REMINDER = 'DONATION_REMINDER',
  CAUSE_MATCH = 'CAUSE_MATCH',
  GENERAL = 'GENERAL',
}

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  cpf: string;
  phone: string;
  birthDate: Date;
  gender: Gender;
  bloodType: BloodType;
  university: string;
  course: string;
  semester: number;
  avatarUrl: string | null;
  role: UserRole;
  potentialLivesSaved: number;
  lastDonationDate: Date | null;
  nextEligibleDate: Date | null;
  isEligible: boolean;
  consecutiveStreak: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Cause {
  id: string;
  title: string;
  description: string;
  hospital: string;
  city: string;
  urgencyLevel: number;
  stockLevel: 'critical' | 'low' | 'moderate' | 'stable';
  bloodTypesNeeded: BloodType[];
  active: boolean;
  expiresAt: Date;
  createdById: string;
  createdBy: User;
  donations: CauseDonation[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Donation {
  id: string;
  userId: string;
  user: User;
  scheduledDate: Date;
  completedDate: Date | null;
  status: DonationStatus;
  hospital: string;
  city: string;
  causeDonation: CauseDonation | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CauseDonation {
  id: string;
  causeId: string;
  cause: Cause;
  donationId: string;
  donation: Donation;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  user: User;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl: string | null;
  createdAt: Date;
}
