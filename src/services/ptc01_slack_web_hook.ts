// https://api.slack.com/apps/A0617J9C7HR/incoming-webhooks?success=1 에서 확인
// https://hooks.slack.com/services/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

import axios from 'axios';
const webhookUrl = 'https://hooks.slack.com/services/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';  // Replace with your actual Slack webhook URL

async function sendSlackNotification(message: string): Promise<void> {
    // let webhookUrl = 'https://hooks.slack.com/services/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';  // Replace with your actual Slack webhook URL
    try {
        await axios.post(webhookUrl, {
        text: message,
        });
        console.log('Slack notification sent successfully.');
    } catch (error) {
        console.error('Error sending Slack notification:', error);
    }
}

const messageToSend = 'test message~~!';

// sendSlackNotification(webhookUrl, messageToSend);
// sendSlackNotification('test message in local~');

export { sendSlackNotification };