import type { Job } from 'bull';
import { notificationService } from '@services/notification.service.js';
import { logger } from '@utils/logger.js';

interface NotificationJobData {
  type: 'email' | 'sms' | 'push';
  recipient: string;
  subject?: string;
  message: string;
}

export const notificationSenderJob = async (job: Job<NotificationJobData>): Promise<void> => {
  const { type, recipient, subject, message } = job.data;

  logger.info(`Sending ${type} notification to ${recipient}`);

  switch (type) {
    case 'email':
      await notificationService.sendEmail(recipient, subject || '', message);
      break;
    case 'sms':
      await notificationService.sendSMS(recipient, message);
      break;
    case 'push':
      await notificationService.sendPushNotification(recipient, subject || '', message);
      break;
  }

  logger.info(`Notification sent: ${type} to ${recipient}`);
};