import { BloodType } from '../types';

export const BLOOD_TYPE_LABELS: Record<BloodType, string> = {
  [BloodType.A_POSITIVE]: 'A+',
  [BloodType.A_NEGATIVE]: 'A-',
  [BloodType.B_POSITIVE]: 'B+',
  [BloodType.B_NEGATIVE]: 'B-',
  [BloodType.AB_POSITIVE]: 'AB+',
  [BloodType.AB_NEGATIVE]: 'AB-',
  [BloodType.O_POSITIVE]: 'O+',
  [BloodType.O_NEGATIVE]: 'O-',
};

export const BLOOD_TYPE_COLORS: Record<BloodType, string> = {
  [BloodType.A_POSITIVE]: '#DC2626',
  [BloodType.A_NEGATIVE]: '#B91C1C',
  [BloodType.B_POSITIVE]: '#2563EB',
  [BloodType.B_NEGATIVE]: '#1D4ED8',
  [BloodType.AB_POSITIVE]: '#7C3AED',
  [BloodType.AB_NEGATIVE]: '#6D28D9',
  [BloodType.O_POSITIVE]: '#16A34A',
  [BloodType.O_NEGATIVE]: '#15803D',
};

const COMPATIBILITY_MAP: Record<BloodType, BloodType[]> = {
  [BloodType.O_NEGATIVE]: [
    BloodType.O_NEGATIVE,
    BloodType.O_POSITIVE,
    BloodType.A_NEGATIVE,
    BloodType.A_POSITIVE,
    BloodType.B_NEGATIVE,
    BloodType.B_POSITIVE,
    BloodType.AB_NEGATIVE,
    BloodType.AB_POSITIVE,
  ],
  [BloodType.O_POSITIVE]: [
    BloodType.O_POSITIVE,
    BloodType.A_POSITIVE,
    BloodType.B_POSITIVE,
    BloodType.AB_POSITIVE,
  ],
  [BloodType.A_NEGATIVE]: [
    BloodType.A_NEGATIVE,
    BloodType.A_POSITIVE,
    BloodType.AB_NEGATIVE,
    BloodType.AB_POSITIVE,
  ],
  [BloodType.A_POSITIVE]: [
    BloodType.A_POSITIVE,
    BloodType.AB_POSITIVE,
  ],
  [BloodType.B_NEGATIVE]: [
    BloodType.B_NEGATIVE,
    BloodType.B_POSITIVE,
    BloodType.AB_NEGATIVE,
    BloodType.AB_POSITIVE,
  ],
  [BloodType.B_POSITIVE]: [
    BloodType.B_POSITIVE,
    BloodType.AB_POSITIVE,
  ],
  [BloodType.AB_NEGATIVE]: [
    BloodType.AB_NEGATIVE,
    BloodType.AB_POSITIVE,
  ],
  [BloodType.AB_POSITIVE]: [
    BloodType.AB_POSITIVE,
  ],
};

export function canDonateTo(donor: BloodType, recipient: BloodType): boolean {
  return COMPATIBILITY_MAP[donor].includes(recipient);
}

export function canReceiveFrom(recipient: BloodType, donor: BloodType): boolean {
  return COMPATIBILITY_MAP[donor].includes(recipient);
}

export function getCompatibleDonors(bloodType: BloodType): BloodType[] {
  const donors: BloodType[] = [];
  for (const [donor, recipients] of Object.entries(COMPATIBILITY_MAP)) {
    if (recipients.includes(bloodType)) {
      donors.push(donor as BloodType);
    }
  }
  return donors;
}

export function getCompatibleRecipients(bloodType: BloodType): BloodType[] {
  return [...COMPATIBILITY_MAP[bloodType]];
}
