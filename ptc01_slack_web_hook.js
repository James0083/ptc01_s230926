"use strict";
// https://hooks.slack.com/services/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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSlackNotification = void 0;
const axios_1 = __importDefault(require("axios"));
function sendSlackNotification(message) {
    return __awaiter(this, void 0, void 0, function* () {
        let webhookUrl = 'https://hooks.slack.com/services/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'; // Replace with your actual Slack webhook URL
        try {
            yield axios_1.default.post(webhookUrl, {
                text: message,
            });
            console.log('Slack notification sent successfully.');
        }
        catch (error) {
            console.error('Error sending Slack notification:', error);
        }
    });
}
exports.sendSlackNotification = sendSlackNotification;
// const webhookUrl = 'https://hooks.slack.com/services/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';  // Replace with your actual Slack webhook URL
const messageToSend = 'test message~~!';
