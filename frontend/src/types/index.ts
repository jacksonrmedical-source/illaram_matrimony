export interface IndividualProfile {
  id: string;
  full_name: string;
  gender: string;
  date_of_birth: string;
  height_cm?: number;
  marital_status: string;
  education?: string;
  profession?: string;
  income_range?: string;
  location_city: string;
  location_state?: string;
  location_country: string;
  about_me?: string;
  tamil_language_importance: string;
  festivals: string[];
  spiritual_orientation: string;
  diet: string;
  family_involvement: string;
  relocation_willingness: string;
  caste?: string;
  subcaste?: string;
  gothram?: string;
  natchathiram?: string;
  rasi?: string;
  completeness_score: number;
  is_selfie_verified: boolean;
  is_govt_id_verified: boolean;
  verification_badges: string[];
  last_active: string;
  user: string;
  primary_photo?: string | null;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user_id?: string;
  is_new_user?: boolean;
}