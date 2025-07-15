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
  title?: string;
  link?: string;
  order?: number;
  active?: boolean;
}

export interface CreateSettingsRequest {
  id?: number;
  type: SettingsType;
  content: string;
  file?: File;
}

export interface UpdateSettingsRequest {
  id: number;
  title?: string;
  link?: string;
  order?: number;
  active?: boolean;
  file?: File;
}

export interface SettingsResponse {
  [key: string]: SettingsConfig[];
}

// For the settings page form
export interface SettingsFormData {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    workingHours: string;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
    emailTemplates: {
      welcome: string;
      passwordReset: string;
      orderConfirmation: string;
    };
  };
  payment: {
    momoEnabled: boolean;
    momoPartnerCode: string;
    momoAccessKey: string;
    momoSecretKey: string;
    bankTransferEnabled: boolean;
    bankAccount: string;
    bankName: string;
    bankBranch: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    googleAnalyticsId: string;
    facebookPixelId: string;
    sitemapEnabled: boolean;
    robotsTxt: string;
  };
  system: {
    maintenanceMode: boolean;
    maintenanceMessage: string;
    cacheEnabled: boolean;
    cacheDuration: number;
    maxUploadSize: number;
    allowedFileTypes: string[];
    debugMode: boolean;
    logLevel: string;
  };
}