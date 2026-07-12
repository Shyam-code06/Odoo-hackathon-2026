import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LayoutContext } from '@/context/LayoutContext';

/**
 * Global layout state provider.
 * Manages sidebar collapse toggles, mobile drawers, responsive menu overlays, 
 * and operational notification logs.
 */
export function LayoutProvider({ children }) {
  const { pathname } = useLocation();
  
  // Collapse sidebar by default on tablet viewports
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      const stored = localStorage.getItem('transitops_sidebar_collapsed');
      if (stored !== null) return JSON.parse(stored);
    } catch {
      // Ignore fallback
    }
    return window.innerWidth < 1024;
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync sidebar collapse to localStorage
  useEffect(() => {
    localStorage.setItem('transitops_sidebar_collapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Auto-close mobile drawer when route changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Adjust collapse states automatically when browser resizes
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

  // Mock global notifications database
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
      title: 'New Trip Assigned',
      description: 'Trip Dispatch TRP-9902 assigned to driver Carlos Santana.',
      time: '1 hour ago',
      isUnread: true,
      category: 'dispatch',
    },
    {
      id: 'notif-3',
      title: 'High Fuel Expense log',
      description: 'Receipt addition for $890.00 flagged for audit inspection.',
      time: '4 hours ago',
      isUnread: false,
      category: 'finance',
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
