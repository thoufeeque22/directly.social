import { test, expect } from '@playwright/test';

test.describe('AIChatbot Component E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a page where the chatbot is available (e.g., dashboard)
    // Assuming the dev server is running on localhost:3000
    await page.goto('http://localhost:3000');
  });

  test('should open and close the chat window', async ({ page, isMobile }) => {
    // Wait for the fab to appear
    const chatFab = page.getByTestId('chat-fab');
    if (!isMobile) {
      await expect(chatFab).toBeVisible();
      await chatFab.click();
    } else {
      // On mobile, the fab might be part of a bottom navigation bar or hidden
      // If it exists, click it, else assume the chatbot is opened via another trigger
      if (await chatFab.isVisible()) {
        await chatFab.click();
      }
    }

    // Verify the chat window and header elements are visible
    const chatWindow = page.getByTestId('chat-window');
    await expect(chatWindow).toBeVisible();

    const closeButton = page.getByTestId('chat-close-button');
    await expect(closeButton).toBeVisible();

    // Close the chat window
    await closeButton.click();
    await expect(chatWindow).not.toBeVisible();
  });

  test('should allow user to type and send a message', async ({ page, isMobile }) => {
    if (!isMobile) {
      await page.getByTestId('chat-fab').click();
    }

    const inputField = page.getByTestId('chat-input').locator('input');
    await expect(inputField).toBeVisible();

    // Type a message
    await inputField.fill('Hello AI');
    await expect(inputField).toHaveValue('Hello AI');

    // Click send
    const sendButton = page.getByTestId('chat-send-button');
    await expect(sendButton).not.toBeDisabled();
    await sendButton.click();

    // The input should be cleared
    await expect(inputField).toHaveValue('');

    // The user message should appear in the message list
    const userMessage = page.getByTestId('chat-message-user').last();
    await expect(userMessage).toContainText('Hello AI');
  });
});
