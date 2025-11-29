import { UserSettings, DailyLog } from '../types';

const USER_KEY = 'ciclo_user';
const LOGS_KEY = 'ciclo_logs';

export const saveUser = (user: UserSettings) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): UserSettings | null => {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveLog = (log: DailyLog) => {
  const logs = getLogs();
  const existingIndex = logs.findIndex(l => l.date === log.date);
  
  if (existingIndex >= 0) {
    logs[existingIndex] = log;
  } else {
    logs.push(log);
  }
  
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
};

export const getLogs = (): DailyLog[] => {
  const data = localStorage.getItem(LOGS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getLogForDate = (dateStr: string): DailyLog | null => {
  const logs = getLogs();
  return logs.find(l => l.date === dateStr) || null;
};

export const clearData = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(LOGS_KEY);
};
