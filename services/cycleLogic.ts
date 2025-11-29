import { addDays, differenceInDays, format, parseISO, subDays } from 'date-fns';
import { UserSettings, CyclePhase } from '../types';

export const getNextPeriodDate = (lastPeriodDate: string, cycleLength: number): Date => {
  return addDays(parseISO(lastPeriodDate), cycleLength);
};

export const getOvulationDate = (nextPeriodDate: Date): Date => {
  return subDays(nextPeriodDate, 14);
};

export const getFertileWindow = (ovulationDate: Date): { start: Date; end: Date } => {
  return {
    start: subDays(ovulationDate, 4),
    end: addDays(ovulationDate, 1) // Traditionally fertile window ends day after ovulation
  };
};

export const getCurrentCycleDay = (lastPeriodDate: string): number => {
  const start = parseISO(lastPeriodDate);
  const today = new Date();
  const diff = differenceInDays(today, start);
  // If diff is negative (future date set?), default to 1
  return diff >= 0 ? diff + 1 : 1;
};

export const getPhaseForDate = (targetDate: Date, user: UserSettings): CyclePhase => {
  const lastPeriod = parseISO(user.lastPeriodDate);
  // Simple projection based on current cycle settings
  // Note: This is a simplified mathematical model. Real bodies vary.
  
  const dayOfCycle = (differenceInDays(targetDate, lastPeriod) % user.cycleLength);
  const adjustedDay = dayOfCycle < 0 ? user.cycleLength + dayOfCycle : dayOfCycle;
  
  const cycleLength = user.cycleLength;
  const periodLength = user.periodLength;
  const lutealLength = 14; // Average
  const ovulationDay = cycleLength - lutealLength;
  
  // Period
  if (adjustedDay < periodLength) {
    return { name: 'Menstrual', description: 'Period', color: 'bg-rose-400' };
  }
  
  // Ovulation Window (approx 5 days leading up to ovulation)
  if (adjustedDay >= ovulationDay - 5 && adjustedDay <= ovulationDay) {
     if (adjustedDay === ovulationDay - 1) {
         return { name: 'Ovulation', description: 'Peak Fertility', color: 'bg-teal-400' };
     }
     return { name: 'Follicular', description: 'Fertile Window', color: 'bg-teal-200' };
  }

  // Luteal
  if (adjustedDay > ovulationDay) {
    return { name: 'Luteal', description: 'PMS Possible', color: 'bg-indigo-200' };
  }

  // Default Follicular (non-fertile)
  return { name: 'Follicular', description: 'Rising Energy', color: 'bg-blue-100' };
};
