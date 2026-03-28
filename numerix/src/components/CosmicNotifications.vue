<script setup>
import { useNotificationStore } from '@/store/notifications'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'

const notifStore = useNotificationStore()
const router = useRouter()
const { t } = useI18n()

const handleNotifItemClick = (notif) => {
  notifStore.markAsRead(notif.id)
  if (notif.route) {
    router.push(notif.route)
    notifStore.toggleDropdown(false)
  }
}
</script>

<template>
  <div class="notif-wrapper">
    <button class="btn-notification" @click="notifStore.toggleDropdown()">
      <span class="notif-icon">🔔</span>
      <div v-if="notifStore.unreadCount > 0" class="notif-badge">{{ notifStore.unreadCount }}</div>
    </button>

    <!-- Notifications Dropdown -->
    <Transition name="fade-slide">
      <div v-if="notifStore.showDropdown" class="notifications-dropdown">
        <div class="notif-header">
          <h3>{{ t('nav.notifications') || 'NOTIFICACIONES' }}</h3>
          <span class="notif-mark-all" @click="notifStore.markAllAsRead">{{ t('nav.markAll') || 'MARCAR TODO' }}</span>
        </div>
        <div class="notif-list">
          <div v-if="notifStore.sortedNotifications.length === 0" class="notif-empty">
            <span class="empty-icon">✨</span>
            <p>Tu cielo está despejado. No hay señales nuevas.</p>
          </div>
          <div 
            v-for="notif in notifStore.sortedNotifications" 
            :key="notif.id" 
            :class="['notif-item', { unread: notif.unread }]"
            @click="handleNotifItemClick(notif)"
          >
            <div class="notif-item-icon">{{ notif.icon }}</div>
            <div class="notif-item-content">
              <p class="notif-item-title">{{ notif.title }}</p>
              <p class="notif-item-desc">{{ notif.desc }}</p>
              <span class="notif-item-time">{{ notif.time }}</span>
            </div>
            <div v-if="notif.unread" class="unread-dot"></div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.notif-wrapper {
  position: relative;
}

.btn-notification {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  color: #fff;
}

.btn-notification:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.notif-icon {
  font-size: 1.2rem;
}

.notif-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #c9a96e;
  color: #0f0c29;
  font-size: 0.65rem;
  font-weight: 800;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #0f0c29;
  box-shadow: 0 0 10px rgba(201, 169, 110, 0.5);
}

.notifications-dropdown {
  position: absolute;
  top: calc(100% + 1rem);
  right: 0;
  width: 320px;
  background: rgba(15, 12, 41, 0.96);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(201, 169, 110, 0.2);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
  z-index: 1000;
  overflow: hidden;
}

.notif-header {
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notif-header h3 {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 2px;
  color: #c9a96e;
  margin: 0;
}

.notif-mark-all {
  font-size: 0.6rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: color 0.3s;
  letter-spacing: 0.5px;
}

.notif-mark-all:hover {
  color: #c9a96e;
}

.notif-list {
  max-height: 400px;
  overflow-y: auto;
}

.notif-empty {
  padding: 3rem 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
}

.empty-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.notif-empty p {
  font-size: 0.8rem;
  line-height: 1.5;
}

.notif-item {
  display: flex;
  gap: 1rem;
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.notif-item:hover {
  background: rgba(255, 255, 255, 0.03);
}

.notif-item.unread {
  background: rgba(201, 169, 110, 0.04);
}

.notif-item-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.notif-item-content {
  flex: 1;
}

.notif-item-title {
  font-size: 0.75rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.2rem;
  letter-spacing: 0.5px;
}

.notif-item-desc {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 0.4rem;
  line-height: 1.4;
}

.notif-item-time {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.3);
}

.unread-dot {
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  width: 8px;
  height: 8px;
  background: #c9a96e;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(201, 169, 110, 0.5);
}

/* Transiciones */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* Scrollbar */
.notif-list::-webkit-scrollbar {
  width: 5px;
}
.notif-list::-webkit-scrollbar-track {
  background: transparent;
}
.notif-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}
</style>
