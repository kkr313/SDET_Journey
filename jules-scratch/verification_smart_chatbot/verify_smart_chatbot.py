import os
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.goto("http://localhost:8000/index.html")

        # 1. Open the chatbot
        chatbot_toggle = page.locator("#chatbot-toggle")
        expect(chatbot_toggle).to_be_visible()
        chatbot_toggle.click()

        # 2. Verify the chat window is visible
        chatbot_window = page.locator("#chatbot-window")
        expect(chatbot_window).to_be_visible(timeout=5000)

        # 3. Ask a question that should now be found by the deep search
        chat_input = page.locator("#chatbot-input")
        expect(chat_input).to_be_editable()
        chat_input.fill("how to test on mobile?")

        # 4. Click the send button
        send_button = page.locator("#chatbot-send")
        send_button.click()

        # 5. Verify the bot's intelligent response
        # The bot will add a new message, so we look for the second one
        bot_response = page.locator(".chatbot-message.bot").nth(1)
        expect(bot_response).to_be_visible(timeout=5000)

        # Check that the response contains the expected text and structure
        expect(bot_response.locator("strong")).to_contain_text("Web & Mobile Manual Testing")
        expect(bot_response.locator(".search-snippet.content")).to_be_visible()

        # 6. Verify the link contains the correct topic and section index
        response_link = bot_response.locator("a.chatbot-link")
        expect(response_link).to_be_visible()
        expect(response_link).to_have_attribute("data-topic-id", "web-mobile-manual-testing")
        expect(response_link).to_have_attribute("data-section-index") # Just check for existence

        # 7. Take a screenshot to visually confirm the new response format
        page.screenshot(path="jules-scratch/verification_smart_chatbot/verification.png")

        browser.close()
        print("Verification script for the smart chatbot ran successfully and a screenshot was taken.")

if __name__ == "__main__":
    run_verification()