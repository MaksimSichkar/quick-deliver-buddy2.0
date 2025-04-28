// Check if notifications are supported
export const areNotificationsSupported = (): boolean => {
  return 'Notification' in window;
};

// Request notification permissions
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!areNotificationsSupported()) {
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Schedule a notification (mock)
export const scheduleNotification = async (
  title: string,
  body: string,
  triggerTime: Date
): Promise<boolean> => {
  if (!areNotificationsSupported()) {
    console.log('Notifications not supported');
    return false;
  }

  const permission = await requestNotificationPermission();
  if (!permission) {
    console.log('Notification permission denied');
    return false;
  }

  const now = new Date();
  const timeUntilTrigger = triggerTime.getTime() - now.getTime();

  // For demo, we'll just log this, but in a real app we'd use a service worker
  console.log(`Scheduling notification "${title}" to trigger in ${timeUntilTrigger}ms`);
  
  if (timeUntilTrigger <= 0) {
    // If the trigger time is in the past, show now
    new Notification(title, { body });
  } else {
    // Otherwise, schedule for the future
    setTimeout(() => {
      new Notification(title, { body });
    }, timeUntilTrigger);
  }

  return true;
};

// Show a notification immediately
export const showNotification = async (
  title: string,
  body: string
): Promise<boolean> => {
  if (!areNotificationsSupported()) {
    return false;
  }

  const permission = await requestNotificationPermission();
  if (!permission) {
    return false;
  }

  new Notification(title, { body });
  return true;
};
