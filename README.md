# Friend Contact Tracker

A web application to help you maintain relationships by tracking friends, contact frequency, and important dates.

## Features

### Core Functionality
- **Friend Management**: Add, edit, and delete friends with contact information
- **Category System**: Organize friends into customizable categories (Close Friends, Friends, Acquaintances, Professional, Family)
- **Contact Tracking**: Log contacts and track when you last spoke with each friend
- **Smart Reminders**: Visual indicators show which friends are due for contact (green = good, yellow = due soon, red = overdue)
- **Important Dates**: Track birthdays, anniversaries, and other important events
- **Notifications**: In-app notifications for friends due today, overdue contacts, and upcoming important dates
- **Contact History**: Full timeline of all your interactions with each friend

### Dashboard Features
- Quick stats showing total friends, contacts due today, overdue contacts, and upcoming events
- Filter friends by category, status (due today, due this week, overdue)
- Sort by next due date, last contacted, alphabetical, or most overdue
- Search friends by name
- Quick "Log Contact" button on each friend card

### Data Storage
- All data stored locally in your browser using localStorage
- No account or backend required
- Data persists between sessions
- Export/import functionality for backups (coming soon)

## Getting Started

### Prerequisites
- Node.js 20.19+ or 22.12+ (recommended)
- npm or yarn

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage Guide

### Adding Your First Friend

1. Click the "+ Add Friend" button on the dashboard
2. Fill in the required fields:
   - Name (required)
   - Contact info - phone, email, or social media handle (required)
   - Last contacted date (defaults to today)
   - Select one or more categories
   - Set how often you want to contact them (the first category's default frequency will be suggested)
   - Add notes about your last conversation
   - Add important dates (optional)
3. Click "Add Friend"

### Managing Categories

1. Click "Categories" in the navigation
2. View all your categories with their default contact frequencies
3. Add new categories with custom colors and frequencies
4. Edit or delete existing categories
5. See how many friends are in each category

### Logging Contact

There are two ways to log contact with a friend:

1. **Quick Log**: Click the "Log Contact" button on any friend card
2. **Detailed Log**: Click on a friend card to open their profile, then click "Log Contact" to add notes

### Viewing Notifications

1. Click the bell icon in the top-right corner
2. See all friends due today, overdue contacts, and upcoming important dates
3. Notifications automatically update based on your data

### Using Filters and Search

- **Search**: Type in the search box to find friends by name
- **Category Filter**: Click category badges to filter by one or more categories
- **Status Filter**: Use the dropdown to show only friends due today, this week, or overdue
- **Sort**: Choose how to sort your friends list (by due date, last contacted, alphabetically, or most overdue)

## Data Structure

### Friend Object
```javascript
{
  id: "unique-id",
  name: "Friend Name",
  contact: "phone/email/social",
  lastContacted: "2024-01-15T12:00:00.000Z",
  contactFrequency: { value: 2, unit: "weeks" },
  categories: ["category-id-1", "category-id-2"],
  importantDates: [
    {
      id: "date-id",
      title: "Birthday",
      date: "2024-06-15",
      type: "recurring",
      notificationDaysBefore: 3,
      notes: "Loves chocolate cake"
    }
  ],
  notes: "Last conversation topics...",
  contactHistory: [
    {
      id: "contact-id",
      date: "2024-01-15T12:00:00.000Z",
      notes: "Caught up over coffee"
    }
  ]
}
```

### Category Object
```javascript
{
  id: "unique-id",
  name: "Close Friends",
  defaultFrequency: { value: 5, unit: "days" },
  color: "#ef4444"
}
```

## Technical Details

### Built With
- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **date-fns** - Date manipulation
- **localStorage** - Data persistence

### Project Structure
```
src/
├── components/          # React components
│   ├── Dashboard.jsx    # Main dashboard view
│   ├── FriendCard.jsx   # Friend list item
│   ├── FriendForm.jsx   # Add/edit friend form
│   ├── FriendProfile.jsx # Friend detail view
│   ├── CategoryManager.jsx # Category management
│   └── NotificationPanel.jsx # Notifications
├── context/
│   └── AppContext.jsx   # Global state management
├── utils/
│   ├── localStorage.js  # Data persistence utilities
│   └── dateHelpers.js   # Date calculation utilities
├── App.jsx              # Main app component
└── main.jsx             # Entry point
```

### Key Algorithms

**Contact Due Calculation**:
```javascript
nextContactDue = lastContacted + contactFrequency
isDue = currentDate >= nextContactDue
daysOverdue = currentDate - nextContactDue
```

**Status Determination**:
- Overdue: Next due date is in the past
- Due Today: Next due date is today
- Due Soon: Next due date is within 3 days
- Good: Next due date is more than 3 days away

## Browser Compatibility

This application works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Data Privacy

All data is stored locally in your browser. No data is sent to any server. Your friend information never leaves your device.

## Future Enhancements

Potential features for future versions:
- Email/SMS integration for actual notifications
- Cloud backup and sync
- Data export in multiple formats (CSV, JSON)
- Analytics and insights about your relationships
- Mobile app versions
- Calendar integration
- Shared friend lists for couples/teams

## Troubleshooting

### Data Not Saving
- Check browser localStorage is enabled
- Clear browser cache and reload
- Check browser console for errors

### App Not Loading
- Ensure you're using a modern browser
- Clear browser cache
- Check console for errors
- Ensure dev server is running on port 5173

### Performance Issues
- If tracking 100+ friends, consider using filters to reduce visible items
- Clear old contact history entries if needed

## License

This project is open source and available for personal use.

## Support

For issues or questions, please check the console for error messages and ensure your browser supports modern JavaScript features.

---

Built with care to help you maintain meaningful relationships! 🤝
