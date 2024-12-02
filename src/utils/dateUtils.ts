import { format } from 'date-fns';

export const formatDate = (date: any): string => {
  if (!date) return 'Unknown date';
  
  try {
    // If it's a Firestore timestamp
    if (date?.toDate) {
      return format(date.toDate(), 'MMM d, HH:mm');
    }
    
    // If it's an ISO string or Date object
    return format(new Date(date), 'MMM d, HH:mm');
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
};

export const formatFullDate = (date: any): string => {
  if (!date) return 'Unknown date';
  
  try {
    // If it's a Firestore timestamp
    if (date?.toDate) {
      return format(date.toDate(), 'MMM d, yyyy HH:mm');
    }
    
    // If it's an ISO string or Date object
    return format(new Date(date), 'MMM d, yyyy HH:mm');
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
};