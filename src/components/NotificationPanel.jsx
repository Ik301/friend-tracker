import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { calculateNextContactDue, getContactStatus, getUpcomingDates, formatRelativeDate } from '../utils/dateHelpers';

const NotificationPanel = ({ isOpen, onClose }) => {
  const { friends, notifications, markNotificationRead, dismissNotification } = useApp();

  const generatedNotifications = useMemo(() => {
    const notifs = [];

    // Friends due today
    const dueToday = friends.filter(f => {
      const nextDue = calculateNextContactDue(f.lastContacted, f.contactFrequency);
      return getContactStatus(nextDue) === 'due-today';
    });

    if (dueToday.length > 0) {
      notifs.push({
        id: 'due-today',
        type: 'due-today',
        title: `${dueToday.length} friend${dueToday.length !== 1 ? 's' : ''} to contact today`,
        friends: dueToday.map(f => f.name),
        priority: 'high'
      });
    }

    // Overdue friends
    const overdue = friends.filter(f => {
      const nextDue = calculateNextContactDue(f.lastContacted, f.contactFrequency);
      return getContactStatus(nextDue) === 'overdue';
    });

    if (overdue.length > 0) {
      notifs.push({
        id: 'overdue',
        type: 'overdue',
        title: `${overdue.length} overdue contact${overdue.length !== 1 ? 's' : ''}`,
        friends: overdue.map(f => f.name),
        priority: 'urgent'
      });
    }

    // Important dates today
    const upcomingDates = getUpcomingDates(friends, 0);
    if (upcomingDates.length > 0) {
      notifs.push({
        id: 'dates-today',
        type: 'important-date',
        title: `${upcomingDates.length} important date${upcomingDates.length !== 1 ? 's' : ''} today`,
        dates: upcomingDates,
        priority: 'high'
      });
    }

    // Important dates this week
    const thisWeek = getUpcomingDates(friends, 7).filter(d => d.daysUntil > 0);
    if (thisWeek.length > 0) {
      notifs.push({
        id: 'dates-week',
        type: 'important-date',
        title: `${thisWeek.length} important date${thisWeek.length !== 1 ? 's' : ''} this week`,
        dates: thisWeek,
        priority: 'medium'
      });
    }

    return notifs;
  }, [friends]);

  const allNotifications = [...notifications, ...generatedNotifications];
  const unreadCount = allNotifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-900/10 border-red-900/30';
      case 'high':
        return 'bg-orange-900/10 border-orange-900/30';
      case 'medium':
        return 'bg-yellow-900/10 border-yellow-900/30';
      default:
        return 'bg-blue-900/10 border-blue-900/30';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111111] border border-[#222222] rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-[#222222]">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-6">
          {allNotifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No notifications</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`border rounded-lg p-4 ${getPriorityColor(notification.priority)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white">{notification.title}</h3>
                    {notification.dismissible !== false && (
                      <button
                        onClick={() => dismissNotification(notification.id)}
                        className="text-gray-500 hover:text-white"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {notification.friends && (
                    <div className="text-sm text-white">
                      <ul className="list-disc list-inside">
                        {notification.friends.slice(0, 5).map((name, idx) => (
                          <li key={idx}>{name}</li>
                        ))}
                        {notification.friends.length > 5 && (
                          <li className="text-gray-500">
                            and {notification.friends.length - 5} more...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {notification.dates && (
                    <div className="text-sm text-white space-y-1">
                      {notification.dates.slice(0, 5).map((date, idx) => (
                        <div key={idx}>
                          <span className="font-medium">{date.friendName}</span>: {date.title}
                          <span className="text-gray-500 ml-2">
                            ({date.daysUntil === 0 ? 'Today' : `In ${date.daysUntil} days`})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {notification.message && (
                    <p className="text-sm text-white mt-2">{notification.message}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
