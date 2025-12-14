import { addDays, addWeeks, addMonths, differenceInDays, isPast, isFuture, format, parseISO } from 'date-fns';

export const calculateNextContactDue = (lastContacted, contactFrequency) => {
  if (!lastContacted || !contactFrequency) return null;

  const lastContactDate = typeof lastContacted === 'string' ? parseISO(lastContacted) : lastContacted;
  const { value, unit } = contactFrequency;

  switch (unit) {
    case 'days':
      return addDays(lastContactDate, value);
    case 'weeks':
      return addWeeks(lastContactDate, value);
    case 'months':
      return addMonths(lastContactDate, value);
    default:
      return null;
  }
};

export const getDaysUntilDue = (nextContactDue) => {
  if (!nextContactDue) return null;
  const dueDate = typeof nextContactDue === 'string' ? parseISO(nextContactDue) : nextContactDue;
  return differenceInDays(dueDate, new Date());
};

export const getContactStatus = (nextContactDue) => {
  const daysUntil = getDaysUntilDue(nextContactDue);

  if (daysUntil === null) return 'unknown';
  if (daysUntil < 0) return 'overdue';
  if (daysUntil === 0) return 'due-today';
  if (daysUntil <= 3) return 'due-soon';
  return 'good';
};

export const getStatusColor = (status) => {
  const colors = {
    'overdue': 'bg-red-100 border-red-500 text-red-900',
    'due-today': 'bg-orange-100 border-orange-500 text-orange-900',
    'due-soon': 'bg-yellow-100 border-yellow-500 text-yellow-900',
    'good': 'bg-green-100 border-green-500 text-green-900',
    'unknown': 'bg-gray-100 border-gray-500 text-gray-900'
  };
  return colors[status] || colors.unknown;
};

export const formatDate = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d, yyyy');
};

export const formatRelativeDate = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const days = differenceInDays(new Date(), dateObj);

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days === -1) return 'Tomorrow';
  if (days > 0) return `${days} days ago`;
  return `In ${Math.abs(days)} days`;
};

export const formatRelativeDateLong = (date) => {
  if (!date) return 'Never';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const days = differenceInDays(new Date(), dateObj);

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  }
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  }
  const years = Math.floor(days / 365);
  return `${years} year${years !== 1 ? 's' : ''} ago`;
};

export const shouldShowDateReminder = (importantDate, notificationDaysBefore = 3) => {
  if (!importantDate.date) return false;

  const dateObj = typeof importantDate.date === 'string' ? parseISO(importantDate.date) : importantDate.date;
  const daysUntil = differenceInDays(dateObj, new Date());

  return daysUntil >= 0 && daysUntil <= notificationDaysBefore;
};

export const getUpcomingDates = (friends, daysAhead = 7) => {
  const upcoming = [];
  const today = new Date();

  friends.forEach(friend => {
    if (!friend.importantDates) return;

    friend.importantDates.forEach(importantDate => {
      const dateObj = typeof importantDate.date === 'string' ? parseISO(importantDate.date) : importantDate.date;
      const daysUntil = differenceInDays(dateObj, today);

      if (daysUntil >= 0 && daysUntil <= daysAhead) {
        upcoming.push({
          ...importantDate,
          friendId: friend.id,
          friendName: friend.name,
          daysUntil
        });
      }
    });
  });

  return upcoming.sort((a, b) => a.daysUntil - b.daysUntil);
};

export const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
