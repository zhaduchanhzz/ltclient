export enum SettingsType {
  FEEDBACK = "FEEDBACK",
  BACKGROUND = "BACKGROUND",
  CONTACT_ZALO = "CONTACT_ZALO",
  CONTACT_FACEBOOK = "CONTACT_FACEBOOK",
  CONTACT_TELEGRAM = "CONTACT_TELEGRAM",
  EMAIL = "EMAIL",
  PHONE_NUMBER = "PHONE_NUMBER",
  LOGO = "LOGO",
  SLIDES = "SLIDES",
}

export interface SettingsConfig {
  id: number;
  type: SettingsType;
  content: string;
  link?: string;
}

export interface CreateSettingsRequest {
  id?: number;
  type: SettingsType;
  content: string;
}

export interface UpdateSettingsRequest {
  id: number;
  link?: string;
}

export interface SettingsResponse {
  [key: string]: SettingsConfig[];
}

// Delete settings request
export interface DeleteSettingsRequest {
  id: number;
}
