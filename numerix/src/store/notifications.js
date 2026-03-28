import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    notifications: JSON.parse(localStorage.getItem('cosmic_notifications') || '[]'),
    showDropdown: false
  }),

  getters: {
    unreadCount: (state) => state.notifications.filter(n => n.unread).length,
    sortedNotifications: (state) => {
      // Sort by ID descending (newest first)
      return [...state.notifications].sort((a, b) => b.id - a.id);
    }
  },

  actions: {
    addNotification({ title, desc, icon = '✨', type = 'info', route = null }) {
      const newNotif = {
        id: Date.now(),
        title: title.toUpperCase(),
        desc,
        icon,
        type,
        route,
        time: 'Ahora',
        unread: true,
        timestamp: new Date().toISOString()
      };
      
      this.notifications.unshift(newNotif);
      this.saveToStorage();
      
      // If the user is on a page with a different notification bell, 
      // they'll see the badge update immediately.
    },

    markAsRead(id) {
      const notif = this.notifications.find(n => n.id === id);
      if (notif) {
        notif.unread = false;
        this.saveToStorage();
      }
    },

    markAllAsRead() {
      this.notifications.forEach(n => n.unread = false);
      this.saveToStorage();
    },

    removeNotification(id) {
      this.notifications = this.notifications.filter(n => n.id !== id);
      this.saveToStorage();
    },

    clearAll() {
      this.notifications = [];
      this.saveToStorage();
    },

    toggleDropdown(value) {
      this.showDropdown = value !== undefined ? value : !this.showDropdown;
    },

    saveToStorage() {
      localStorage.setItem('cosmic_notifications', JSON.stringify(this.notifications));
    }
  }
});
