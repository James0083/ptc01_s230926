// https://hooks.slack.com/services/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

import axios from 'axios';

async function sendSlackNotification(message: string): Promise<void> {
    let webhookUrl = 'https://hooks.slack.com/services/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';  // Replace with your actual Slack webhook URL
    try {
        await axios.post(webhookUrl, {
        text: message,
        });
        console.log('Slack notification sent successfully.');
    } catch (error) {
        console.error('Error sending Slack notification:', error);
    }
}

// const webhookUrl = 'https://hooks.slack.com/services/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';  // Replace with your actual Slack webhook URL
const messageToSend = 'test message~~!';

// sendSlackNotification(webhookUrl, messageToSend);
// sendSlackNotification('test message in local~');

export { sendSlackNotification };