export type DoseStatus = "taken" | "missed" | "skipped";

export interface Profile {
  id: string;
  display_name: string;
  avatar_color: string;
  created_at: string;
  updated_at: string;
}

export interface Medication {
  id: string;
  user_id: string;
  name: string;
  dosage: string;
  form: string;
  instructions: string;
  color: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MedicationSchedule {
  id: string;
  medication_id: string;
  user_id: string;
  time_of_day: string;
  weekdays: number[];
  timezone: string;
  label: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DoseLog {
  id: string;
  user_id: string;
  medication_id: string | null;
  schedule_id: string | null;
  medication_name: string;
  dosage: string;
  scheduled_for: string;
  status: DoseStatus;
  taken_at: string | null;
  notes: string;
  created_at: string;
}

export interface CareInvite {
  id: string;
  patient_id: string;
  code: string;
  expires_at: string;
  accepted_by: string | null;
  accepted_at: string | null;
  created_at: string;
}

export interface CareConnection {
  id: string;
  patient_id: string;
  caregiver_id: string;
  invite_id: string | null;
  created_at: string;
}

export type AppTab = "today" | "medications" | "history" | "family";
