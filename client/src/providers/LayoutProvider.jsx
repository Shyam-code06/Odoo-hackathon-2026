import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LayoutContext } from '@/context/LayoutContext';

/**
 * Global layout state provider.
 * Manages sidebar collapse, mobile drawers, responsive behavior, and notification logs.
 * Notifications include category and icon metadata for the notification center.
 */
export function LayoutProvider({ children }) {
  const { pathname } = useLocation();

  // Persist sidebar collapse state to localStorage
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      const stored = localStorage.getItem('transitops_sidebar_collapsed');
      if (stored !== null) return JSON.parse(stored);
    } catch {
      // Ignore
    }
    return window.innerWidth < 1024;
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('transitops_sidebar_collapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Auto-close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobileMenuOpen(false);
      } else if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Expanded notifications with categories and timestamps
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Overdue Maintenance Alert',
      description: 'Truck Plate TX-3921 exceeded oil service interval by 240 miles.',
      time: '12 mins ago',
      isUnread: true,
      category: 'maintenance',
    },
    {
      id: 'notif-2',
      title: 'New Trip Dispatched',
      description: 'Trip TRP-9902 assigned to driver Carlos Santana — Chicago to Detroit.',
      time: '1 hour ago',
      isUnread: true,
      category: 'dispatch',
    },
    {
      id: 'notif-3',
      title: 'High Fuel Expense Flagged',
      description: 'Receipt FL-0094 for $890.00 flagged for compliance audit.',
      time: '4 hours ago',
      isUnread: false,
      category: 'finance',
    },
    {
      id: 'notif-4',
      title: 'Driver License Expiring Soon',
      description: 'Driver Maria Lopez — CDL expires in 14 days. Renewal required.',
      time: '6 hours ago',
      isUnread: true,
      category: 'drivers',
    },
    {
      id: 'notif-5',
      title: 'Vehicle GPS Signal Lost',
      description: 'Van VN-1122 GPS signal lost — last known location: Route I-90.',
      time: 'Yesterday',
      isUnread: false,
      category: 'vehicles',
    },
  ]);

  const markNotificationAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: false } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  }, []);

  const clearNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  const value = {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    toggleSidebar,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotification,
  };

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}

export default LayoutProvider;
