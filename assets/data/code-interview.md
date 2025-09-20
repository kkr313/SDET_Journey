# Coding Interview Questions for SDETs

This section contains common coding interview questions for SDET positions with solutions in multiple programming languages.

## String Manipulation

### Reverse a String

#### Problem Statement:
Write a function that reverses a string. The input string is given as an array of characters.

**Example:**
```
Input: ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]
```

**Constraints:**
- Do this in-place with O(1) extra space.

#### Explanation:
This is a classic problem that tests your understanding of in-place array manipulation. The goal is to reverse the array without using extra space. We can use a two-pointer approach where we swap characters from both ends of the array and move towards the center.

#### Solution:

<tabs>
<tab name="JavaScript">
```javascript
function reverseString(s) {
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
        // Swap characters
        const temp = s[left];
        s[left] = s[right];
        s[right] = temp;
        
        left++;
        right--;
    }
    
    return s;
}

// Example usage
const inputStr = ["h", "e", "l", "l", "o"];
console.log(reverseString(inputStr)); // Output: ['o', 'l', 'l', 'e', 'h']
```
<button class="copy-button" onclick="copyCode(this)">Copy</button>
</tab>

<tab name="Python">
```python
def reverse_string(s):
    left, right = 0, len(s) - 1
    while left < right:
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1
    return s

# Example usage
input_str = ["h", "e", "l", "l", "o"]
print(reverse_string(input_str))  # Output: ['o', 'l', 'l', 'e', 'h']
```
<button class="copy-button" onclick="copyCode(this)">Copy</button>
</tab>

<tab name="Result">
<div class="code-editor">
<div class="editor-header">
  <select id="language-selector" onchange="updateCodeEditor(this)">
    <option value="javascript">JavaScript</option>
    <option value="python">Python</option>
  </select>
  <button class="run-button" onclick="executeCode('code-input', 'execution-result')">Run</button>
</div>
<textarea id="code-input" rows="10">
// Edit this code and click Run
function reverseString(s) {
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
        // Swap characters
        const temp = s[left];
        s[left] = s[right];
        s[right] = temp;
        
        left++;
        right--;
    }
    
    return s;
}

// Example usage
const inputStr = ["h", "e", "l", "l", "o"];
console.log(reverseString(inputStr));
</textarea>
<div id="execution-result" class="execution-result"></div>
</textarea>
<div class="execution-result" id="execution-result">
Results will appear here...
</div>
</div>
</tab>
</tabs>

## Array Problems

### Find Duplicate Number

#### Problem Statement:
Given an array of integers containing n + 1 integers where each integer is in the range [1, n], find the duplicate number.

**Example:**
```
Input: [1,3,4,2,2]
Output: 2
```

**Constraints:**
- There is only one duplicate number in the array
- You cannot modify the array
- You must use only constant extra space

#### Explanation:
This problem can be solved using the Floyd's Tortoise and Hare (Cycle Detection) algorithm. Since there is a duplicate number, there must be a cycle when we treat the array as a linked list where each value points to the index of that value.

#### Solution:

<tabs>
<tab name="JavaScript">
```javascript
function findDuplicate(nums) {
    // Find the intersection point of the two runners
    let tortoise = nums[0];
    let hare = nums[0];
    
    do {
        tortoise = nums[tortoise];
        hare = nums[nums[hare]];
    } while (tortoise !== hare);
    
    // Find the entrance to the cycle
    tortoise = nums[0];
    while (tortoise !== hare) {
        tortoise = nums[tortoise];
        hare = nums[hare];
    }
    
    return hare;
}

// Example usage
const nums = [1, 3, 4, 2, 2];
console.log(findDuplicate(nums)); // Output: 2
```
</tab>

<tab name="Python">
```python
def find_duplicate(nums):
    # Find the intersection point of the two runners
    tortoise = nums[0]
    hare = nums[0]
    
    while True:
        tortoise = nums[tortoise]
        hare = nums[nums[hare]]
        if tortoise == hare:
            break
    
    # Find the entrance to the cycle
    tortoise = nums[0]
    while tortoise != hare:
        tortoise = nums[tortoise]
        hare = nums[hare]
    
    return hare

# Example usage
nums = [1, 3, 4, 2, 2]
print(find_duplicate(nums))  # Output: 2
```
</tab>

<tab name="Result">
<div class="code-editor">
<select id="language-selector-2">
  <option value="javascript">JavaScript</option>
  <option value="python">Python</option>
</select>
<textarea id="code-input-2" rows="10">
// Edit this code and click Run
function findDuplicate(nums) {
    // Find the intersection point of the two runners
    let tortoise = nums[0];
    let hare = nums[0];
    
    do {
        tortoise = nums[tortoise];
        hare = nums[nums[hare]];
    } while (tortoise !== hare);
    
    // Find the entrance to the cycle
    tortoise = nums[0];
    while (tortoise !== hare) {
        tortoise = nums[tortoise];
        hare = nums[hare];
    }
    
    return hare;
}

// Example usage
const nums = [1, 3, 4, 2, 2];
console.log(findDuplicate(nums));
</textarea>
<button class="run-button" onclick="executeCode('code-input-2', 'execution-result-2')">Run Code</button>
<div class="execution-result" id="execution-result-2">
Results will appear here...
</div>
</div>
</tab>
</tabs>

<tab name="Python">
```python
def find_duplicate(nums):
    # Floyd's Tortoise and Hare (Cycle Detection)
    slow = fast = nums[0]
    
    # Find the intersection point
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    
    # Find the entrance to the cycle
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    
    return slow

# Example usage
nums = [1, 3, 4, 2, 2]
print(find_duplicate(nums))  # Output: 2
```
</tab>

<tab name="JavaScript">
```javascript
function findDuplicate(nums) {
    // Floyd's Tortoise and Hare (Cycle Detection)
    let slow = nums[0];
    let fast = nums[0];
    
    // Find the intersection point
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow !== fast);
    
    // Find the entrance to the cycle
    slow = nums[0];
    while (slow !== fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    
    return slow;
}

// Example usage
const nums = [1, 3, 4, 2, 2];
console.log(findDuplicate(nums)); // Output: 2
```
</tab>

<tab name="Result">
<code-execution language="python">
def find_duplicate(nums):
    # Floyd's Tortoise and Hare (Cycle Detection)
    slow = fast = nums[0]
    
    # Find the intersection point
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    
    # Find the entrance to the cycle
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    
    return slow

# Example usage
nums = [1, 3, 4, 2, 2]
print(find_duplicate(nums))
</code-execution>
</tab>
</tabs>

## API Testing Code

### API Request Example

<tabs>
<tab name="Problem">
Write a function that makes an HTTP GET request to an API endpoint and validates the response.

**Requirements:**
- Make a GET request to "https://jsonplaceholder.typicode.com/posts/1"
- Validate that the response status code is 200
- Validate that the response contains the expected fields (userId, id, title, body)
</tab>

<tab name="Python">
```python
import requests

def test_api_get():
    # Make the request
    response = requests.get("https://jsonplaceholder.typicode.com/posts/1")
    
    # Validate status code
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    
    # Parse JSON response
    data = response.json()
    
    # Validate response structure
    expected_fields = ["userId", "id", "title", "body"]
    for field in expected_fields:
        assert field in data, f"Expected field '{field}' not found in response"
    
    print("API test passed!")
    return data

# Example usage
result = test_api_get()
print(f"Response: {result}")
```
</tab>

<tab name="JavaScript">
```javascript
async function testApiGet() {
    try {
        // Make the request
        const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
        
        // Validate status code
        if (response.status !== 200) {
            throw new Error(`Expected status code 200, got ${response.status}`);
        }
        
        // Parse JSON response
        const data = await response.json();
        
        // Validate response structure
        const expectedFields = ["userId", "id", "title", "body"];
        for (const field of expectedFields) {
            if (!(field in data)) {
                throw new Error(`Expected field '${field}' not found in response`);
            }
        }
        
        console.log("API test passed!");
        return data;
    } catch (error) {
        console.error("API test failed:", error.message);
        throw error;
    }
}

// Example usage
testApiGet()
    .then(result => console.log("Response:", result))
    .catch(error => console.error(error));
```
</tab>

<tab name="Result">
<code-execution language="python">
# This would require network access to run
print("API GET request simulation:")
print({
    "userId": 1,
    "id": 1,
    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
})
print("API test passed!")
</code-execution>
</tab>
</tabs>

## Test Automation Challenges

### Page Object Model Implementation

<tabs>
<tab name="Problem">
Implement a simple Page Object Model for a login page with the following requirements:
- Create a base page class with common methods
- Create a login page class that extends the base page
- Implement methods for entering username, password, and clicking the login button
- Add a validation method to check if login was successful
</tab>

<tab name="Python">
```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class BasePage:
    def __init__(self, driver):
        self.driver = driver
        
    def find_element(self, locator, timeout=10):
        return WebDriverWait(self.driver, timeout).until(
            EC.presence_of_element_located(locator)
        )
    
    def click(self, locator):
        self.find_element(locator).click()
        
    def enter_text(self, locator, text):
        element = self.find_element(locator)
        element.clear()
        element.send_keys(text)
        
    def get_text(self, locator):
        return self.find_element(locator).text

class LoginPage(BasePage):
    # Locators
    USERNAME_INPUT = (By.ID, "username")
    PASSWORD_INPUT = (By.ID, "password")
    LOGIN_BUTTON = (By.ID, "login-button")
    SUCCESS_MESSAGE = (By.ID, "success-message")
    ERROR_MESSAGE = (By.ID, "error-message")
    
    def enter_username(self, username):
        self.enter_text(self.USERNAME_INPUT, username)
        
    def enter_password(self, password):
        self.enter_text(self.PASSWORD_INPUT, password)
        
    def click_login(self):
        self.click(self.LOGIN_BUTTON)
        
    def login(self, username, password):
        self.enter_username(username)
        self.enter_password(password)
        self.click_login()
        
    def is_login_successful(self):
        try:
            success_message = self.get_text(self.SUCCESS_MESSAGE)
            return "Welcome" in success_message
        except:
            return False
            
    def get_error_message(self):
        try:
            return self.get_text(self.ERROR_MESSAGE)
        except:
            return ""

# Example usage
def test_login():
    driver = webdriver.Chrome()
    driver.get("https://example.com/login")
    
    login_page = LoginPage(driver)
    login_page.login("testuser", "password123")
    
    assert login_page.is_login_successful(), f"Login failed: {login_page.get_error_message()}"
    print("Login test passed!")
    
    driver.quit()
```
</tab>

<tab name="JavaScript">
```javascript
class BasePage {
    constructor(driver) {
        this.driver = driver;
    }
    
    async findElement(locator, timeout = 10000) {
        return await this.driver.wait(until.elementLocated(locator), timeout);
    }
    
    async click(locator) {
        const element = await this.findElement(locator);
        await element.click();
    }
    
    async enterText(locator, text) {
        const element = await this.findElement(locator);
        await element.clear();
        await element.sendKeys(text);
    }
    
    async getText(locator) {
        const element = await this.findElement(locator);
        return await element.getText();
    }
}

class LoginPage extends BasePage {
    // Locators
    USERNAME_INPUT = By.id("username");
    PASSWORD_INPUT = By.id("password");
    LOGIN_BUTTON = By.id("login-button");
    SUCCESS_MESSAGE = By.id("success-message");
    ERROR_MESSAGE = By.id("error-message");
    
    async enterUsername(username) {
        await this.enterText(this.USERNAME_INPUT, username);
    }
    
    async enterPassword(password) {
        await this.enterText(this.PASSWORD_INPUT, password);
    }
    
    async clickLogin() {
        await this.click(this.LOGIN_BUTTON);
    }
    
    async login(username, password) {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLogin();
    }
    
    async isLoginSuccessful() {
        try {
            const successMessage = await this.getText(this.SUCCESS_MESSAGE);
            return successMessage.includes("Welcome");
        } catch (error) {
            return false;
        }
    }
    
    async getErrorMessage() {
        try {
            return await this.getText(this.ERROR_MESSAGE);
        } catch (error) {
            return "";
        }
    }
}

// Example usage
async function testLogin() {
    const driver = await new Builder().forBrowser("chrome").build();
    await driver.get("https://example.com/login");
    
    const loginPage = new LoginPage(driver);
    await loginPage.login("testuser", "password123");
    
    const isSuccessful = await loginPage.isLoginSuccessful();
    if (!isSuccessful) {
        const errorMessage = await loginPage.getErrorMessage();
        throw new Error(`Login failed: ${errorMessage}`);
    }
    console.log("Login test passed!");
    
    await driver.quit();
}
```
</tab>

<tab name="Result">
<code-execution language="python">
print("Page Object Model Implementation Example")
print("----------------------------------------")
print("1. Created BasePage with common methods:")
print("   - find_element()")
print("   - click()")
print("   - enter_text()")
print("   - get_text()")
print("\n2. Created LoginPage that extends BasePage:")
print("   - enter_username()")
print("   - enter_password()")
print("   - click_login()")
print("   - login()")
print("   - is_login_successful()")
print("   - get_error_message()")
print("\nSimulated test execution:")
print("Login test passed!")
</code-execution>
</tab>
</tabs>