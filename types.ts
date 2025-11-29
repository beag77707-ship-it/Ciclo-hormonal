export enum CycleGoal {
  UNDERSTAND = 'understand',
  AVOID_PREGNANCY = 'avoid_pregnancy',
  SEEK_PREGNANCY = 'seek_pregnancy'
}

export enum FlowIntensity {
  NONE = 'none',
  SPOTTING = 'spotting',
  LIGHT = 'light',
  MEDIUM = 'medium',
  HEAVY = 'heavy'
}

export enum Mood {
  HAPPY = 'happy',
  CALM = 'calm',
  IRRITATED = 'irritated',
  ANXIOUS = 'anxious',
  SAD = 'sad',
  NEUTRAL = 'neutral'
}

export interface UserSettings {
  name: string;
  email: string;
  cycleLength: number;
  periodLength: number;
  goal: CycleGoal;
  lastPeriodDate: string; // ISO Date string
  notifications: {
    periodReminder: boolean;
    periodReminderDays: number;
    fertileReminder: boolean;
    logReminder: boolean;
  };
  themeImage?: string; // For AI generated theme
}

export interface DailyLog {
  date: string; // ISO Date string (YYYY-MM-DD)
  flow: FlowIntensity;
  symptoms: string[];
  mood: Mood | null;
  notes: string;
  intercourse: boolean;
  protection: boolean;
}

export interface CyclePhase {
  name: 'Menstrual' | 'Follicular' | 'Ovulation' | 'Luteal';
  description: string;
  color: string;
}

export interface Article {
  title: string;
  summary: string;
  url?: string;
  source?: string;
}
