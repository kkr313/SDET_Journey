# 🚀 SDET Journey: From Zero to Hero

A **complete roadmap** for becoming a successful Software Development Engineer in Test (SDET). This guide covers everything from foundational principles to advanced automation, DevOps, and coding skills, designed to take you from a beginner to a master-level SDET.

> 💡 **Pro Tip:** This journey is not linear. You can jump between phases based on your current skill level and job requirements. However, building a strong foundation in Phases 1-3 is highly recommended before advancing.

---

## 📑 Table of Contents

**📍 Getting Started**
- [Introduction to the SDET Role](#introduction-to-the-sdet-role)

**🎯 Learning Phases**
1. [Phase 1: Mastering Quality Assurance Fundamentals](#phase-1-mastering-quality-assurance-fundamentals)
2. [Phase 2: Learning to Code](#phase-2-learning-to-code)
3. [Phase 3: Core Automation Skills](#phase-3-core-automation-skills)
4. [Phase 4: API and Services Testing](#phase-4-api-and-services-testing)
5. [Phase 5: DevOps and CI/CD Integration](#phase-5-devops-and-cicd-integration)
6. [Phase 6: Advanced Automation Concepts](#phase-6-advanced-automation-concepts)
7. [Phase 7: Non-Functional Testing](#phase-7-non-functional-testing)
8. [Phase 8: Database Testing](#phase-8-database-testing)
9. [Phase 9: Cloud and Infrastructure Testing](#phase-9-cloud-and-infrastructure-testing)

**💼 Career & Growth**
- [SDET Interview Preparation](#sdet-interview-preparation)
- [Continuous Learning and Career Growth](#continuous-learning-and-career-growth)
- [Conclusion](#conclusion)

---

## Introduction to the SDET Role

### What is an SDET?
An **SDET (Software Development Engineer in Test)** is a hybrid role that combines the skills of a software developer with those of a quality assurance tester. Unlike traditional testers who focus on manual and black-box testing, an SDET is deeply involved in the development process, writes code for automation, and helps build robust, scalable testing infrastructure.

**Why SDET is in High Demand:**
- 🚀 **Shift-Left Testing:** Companies want to catch bugs early in the development cycle
- 💰 **ROI:** Automated tests save time and money in the long run
- 📈 **Scalability:** Manual testing doesn't scale with rapid releases and microservices architecture
- 🔄 **DevOps Culture:** Testing is integrated into CI/CD pipelines, requiring coding skills

**Key Responsibilities:**
- **Automate Everything:** Design, develop, and maintain automated test scripts for UI, API, and backend services
- **Develop Frameworks:** Build and enhance test automation frameworks that are scalable, maintainable, and easy to use
- **CI/CD Integration:** Integrate testing into the CI/CD pipeline with quality gates and automated reporting
- **Code Reviews:** Participate in code reviews to improve testability, identify edge cases, and ensure quality
- **Tool Development:** Create testing tools, mock services, test data generators, and utilities for the development team
- **Quality Advocacy:** Champion quality best practices, establish testing standards, and mentor team members
- **Performance & Security:** Conduct non-functional testing to ensure applications meet performance and security requirements
- **Documentation:** Create comprehensive test plans, test cases, and framework documentation

### SDET vs. Manual Tester vs. Automation Engineer

| Aspect | Manual Tester | Automation Engineer | SDET |
|---|---|---|---|
| **Primary Skill** | Domain Knowledge | Scripting, Tool Usage | **Development & Testing** |
| **Coding** | Not required | Basic to Intermediate | **Advanced (Data Structures, Algorithms)** |
| **Focus** | Finding bugs | Automating test cases | **Preventing bugs, Building tools** |
| **Involvement** | Post-development | Post-development | **Throughout SDLC** |
| **Scope** | Application UI/UX | Regression Suite | **Entire Stack (UI, API, DB, Perf)** |
| **Tools** | Test Mgmt Tools | Selenium, Cypress | **Selenium, REST-Assured, Jenkins, Docker** |

---

## Phase 1: Mastering Quality Assurance Fundamentals

*Before you can automate, you must understand what to test and why.*

### Core Testing Concepts

#### Software Testing Life Cycle (STLC)
The STLC consists of specific phases executed in a planned sequence:

1. **Requirement Analysis:** Understanding what needs to be tested
2. **Test Planning:** Defining test strategy, scope, resources, and timeline
3. **Test Case Development:** Writing detailed test cases and test scripts
4. **Environment Setup:** Preparing test environments and test data
5. **Test Execution:** Running tests and logging defects
6. **Test Closure:** Analyzing metrics, lessons learned, and documentation

#### Testing Types & Levels

**By Execution Method:**
- **Manual Testing:** Human-executed tests, ideal for exploratory, usability, and ad-hoc testing
- **Automated Testing:** Script-based tests, perfect for regression, smoke, and repetitive tests

**By Test Level:**
- **Unit Testing:** Testing individual components (usually done by developers)
- **Integration Testing:** Testing interactions between integrated components
- **System Testing:** Testing the complete system against requirements
- **Acceptance Testing:** Validating if the system meets business needs (UAT)

**By Test Type:**
- **Functional Testing:** Verifying features work as expected
- **Regression Testing:** Ensuring new changes don't break existing functionality
- **Smoke Testing:** Quick health check of critical functionalities
- **Sanity Testing:** Focused testing on specific functionality after a fix
- **Exploratory Testing:** Unscripted testing to discover unexpected issues

#### Test Design Techniques

**1. Equivalence Partitioning**
Dividing input data into valid and invalid partitions. Test one value from each partition.

*Example:* For an age field (18-65):
- Valid: 18-65 (test with 30)
- Invalid: <18 (test with 10), >65 (test with 70)

**2. Boundary Value Analysis**
Testing at the boundaries of input domains.

*Example:* For age 18-65, test: 17, 18, 19, 64, 65, 66

**3. Decision Table Testing**
Creating a table of all possible combinations of inputs and their expected outputs.

**4. State Transition Testing**
Testing how the system transitions between different states.

#### Defect Management

**Bug Life Cycle:**
New → Assigned → Open → Fixed → Retest → Verified → Closed
(Alternative paths: Rejected, Deferred, Duplicate, Reopen)

**Severity vs Priority:**
| Severity | Priority | Example |
|---|---|---|
| High | High | Payment gateway crash |
| High | Low | Spelling error on rarely used page |
| Low | High | Company logo wrong on homepage |
| Low | Low | Minor UI alignment issue |

**Effective Bug Reporting:**
- **Clear Title:** Summarize the issue in one line
- **Steps to Reproduce:** Detailed, numbered steps
- **Expected vs Actual:** What should happen vs what happens
- **Environment:** OS, browser, version, device
- **Attachments:** Screenshots, logs, videos
- **Severity & Priority:** Impact assessment

> **Action Items:** 
> - Review the **[Manual Testing Concepts Guide](index.html?topic=manual-concepts)** for deeper understanding
> - Explore **[Web & Mobile Manual Testing](index.html?topic=web-mobile-manual-testing)** for practical scenarios
> - Learn about **[Agile Methodology](index.html?topic=agile-methodology)** to understand modern testing approaches

---

## Phase 2: Learning to Code

*Code is your primary tool. Master it.*

### Choose a Programming Language
Most SDET roles require proficiency in one of the following. **Python** and **Java** are the most popular choices, but JavaScript is gaining traction.

| Language | Pros for SDETs | Cons for SDETs | Best For |
|---|---|---|---|
| **Python** | Easy to learn, concise syntax, huge libraries (Pytest, Requests, Selenium), great for scripting and data manipulation | Dynamically typed, can be slower, whitespace-sensitive | API testing, scripting, data-driven testing |
| **Java** | Strongly typed (catches errors early), robust, vast ecosystem (Selenium, TestNG, REST-Assured, Cucumber), industry standard | More verbose, steeper learning curve, slower development | Enterprise applications, UI automation, mobile (Appium) |
| **JavaScript** | Dominant in web, modern frameworks (Cypress, Playwright, Jest), full-stack testing, same language as frontend | Asynchronous nature can be complex, callback hell, type safety requires TypeScript | Frontend testing, modern web apps, Node.js APIs |
| **C#** | Powerful, great for .NET applications, strong typing, excellent IDE support (Visual Studio) | Windows-centric, smaller community for testing | .NET applications, Windows environments |

> **Recommendation:** Start with **Python** if you're new to programming. It has a gentler learning curve and is highly versatile. Switch to **Java** if your organization uses it or you're working with Android apps.

### Core Programming Concepts

#### 1. Variables & Data Types
```python
# Python Example
age = 25                    # Integer
name = "John"              # String
is_active = True           # Boolean
price = 99.99              # Float
items = [1, 2, 3]         # List
user = {"name": "John"}   # Dictionary
```

```java
// Java Example
int age = 25;
String name = "John";
boolean isActive = true;
double price = 99.99;
List<Integer> items = Arrays.asList(1, 2, 3);
Map<String, String> user = new HashMap<>();
```

#### 2. Operators
- **Arithmetic:** `+`, `-`, `*`, `/`, `%` (modulus), `**` (power)
- **Comparison:** `==`, `!=`, `>`, `<`, `>=`, `<=`
- **Logical:** `and` (&&), `or` (||), `not` (!)
- **Assignment:** `=`, `+=`, `-=`, `*=`, `/=`

#### 3. Control Flow

**Conditionals:**
```python
if age >= 18:
    print("Adult")
elif age >= 13:
    print("Teenager")
else:
    print("Child")
```

**Loops:**
```python
# For loop
for i in range(5):
    print(i)

# While loop
count = 0
while count < 5:
    print(count)
    count += 1

# For-each loop
items = ["apple", "banana", "cherry"]
for item in items:
    print(item)
```

#### 4. Functions/Methods
```python
def calculate_total(price, quantity, tax_rate=0.1):
    """Calculate total price with tax"""
    subtotal = price * quantity
    tax = subtotal * tax_rate
    return subtotal + tax

total = calculate_total(10.99, 3, 0.08)
```

#### 5. Object-Oriented Programming (OOP)

**Classes & Objects:**
```python
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email
    
    def greet(self):
        return f"Hello, {self.name}!"

user = User("John", "john@example.com")
print(user.greet())
```

**Inheritance:**
```python
class Employee(User):
    def __init__(self, name, email, employee_id):
        super().__init__(name, email)
        self.employee_id = employee_id
    
    def get_details(self):
        return f"{self.name} ({self.employee_id})"
```

**Polymorphism:**
Different classes implementing the same method differently:
```python
class Dog:
    def speak(self):
        return "Woof!"

class Cat:
    def speak(self):
        return "Meow!"

animals = [Dog(), Cat()]
for animal in animals:
    print(animal.speak())  # Polymorphism in action
```

**Encapsulation:**
```python
class BankAccount:
    def __init__(self, balance):
        self.__balance = balance  # Private attribute
    
    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
    
    def get_balance(self):
        return self.__balance
```

#### 6. Data Structures

**Arrays / Lists:**
```python
numbers = [1, 2, 3, 4, 5]
numbers.append(6)
numbers.remove(3)
print(numbers[0])  # Access by index
```

**Maps / Dictionaries:**
```python
user = {
    "name": "John",
    "age": 30,
    "email": "john@example.com"
}
print(user["name"])
user["phone"] = "123-456-7890"
```

**Sets:**
```python
unique_numbers = {1, 2, 3, 3, 4}  # Duplicates removed
print(unique_numbers)  # {1, 2, 3, 4}
```

#### 7. Exception Handling
```python
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"Error: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
finally:
    print("Cleanup code here")
```

#### 8. File I/O
```python
# Reading from file
with open("test_data.txt", "r") as file:
    data = file.read()

# Writing to file
with open("results.txt", "w") as file:
    file.write("Test passed\n")
```

### Learning Resources

**For Python:**
- 📚 [Python.org Official Tutorial](https://docs.python.org/3/tutorial/)
- 🎓 Codecademy Python Course
- 📺 Corey Schafer's Python Tutorials (YouTube)

**For Java:**
- 📚 [Oracle Java Tutorials](https://docs.oracle.com/javase/tutorial/)
- 🎓 Udemy: Java Programming Masterclass
- 📺 Programming with Mosh (YouTube)

**For JavaScript:**
- 📚 [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- 🎓 freeCodeCamp JavaScript Course
- 📺 Traversy Media (YouTube)

> **Action Items:**
> - Practice coding problems on **[Code Practice](index.html?topic=code-practice)** section
> - Complete 30 easy problems on LeetCode or HackerRank
> - Build a small project: CLI calculator, todo list app, or web scraper
> - Read "Clean Code" by Robert C. Martin

---

## Phase 3: Core Automation Skills

*This is where you apply your coding skills to automate tests.*

### UI Automation
Automating the user interface of web applications.

#### Key Tools Comparison

| Tool | Language | Speed | Learning Curve | Best For | Limitations |
|---|---|---|---|---|---|
| **Selenium** | Java, Python, C#, JS | Moderate | Medium | Cross-browser, Enterprise | Slower, more setup |
| **Cypress** | JavaScript | Fast | Easy | Modern web apps, Developers | JS only, no multi-tab |
| **Playwright** | JS, Python, Java, .NET | Very Fast | Medium | Modern apps, Cross-browser | Newer, smaller community |
| **TestCafe** | JavaScript | Fast | Easy | No WebDriver needed | JS only |

#### Core UI Automation Concepts

**1. Locators - Finding Elements**

**Priority Order (Most Reliable to Least):**
1. **ID:** `driver.find_element(By.ID, "username")`
2. **Name:** `driver.find_element(By.NAME, "email")`
3. **CSS Selector:** `driver.find_element(By.CSS_SELECTOR, "input[type='email']")`
4. **XPath:** `driver.find_element(By.XPATH, "//input[@id='username']")`

**Best Practices:**
- ✅ Use `data-testid` or `data-test` attributes for stable locators
- ✅ Prefer CSS Selectors over XPath (faster, more readable)
- ❌ Avoid absolute XPath (brittle, breaks with UI changes)
- ❌ Don't use text-based locators if text changes frequently

**Example - CSS Selectors:**
```python
# By ID
driver.find_element(By.CSS_SELECTOR, "#username")

# By Class
driver.find_element(By.CSS_SELECTOR, ".login-button")

# By Attribute
driver.find_element(By.CSS_SELECTOR, "input[placeholder='Enter email']")

# Combining
driver.find_element(By.CSS_SELECTOR, "div.form-group > input#username")

# nth-child
driver.find_element(By.CSS_SELECTOR, "ul.menu li:nth-child(2)")
```

**2. Waits - Handling Dynamic Content**

```python
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Implicit Wait (not recommended - global, unpredictable)
driver.implicitly_wait(10)

# Explicit Wait (recommended)
wait = WebDriverWait(driver, 10)
element = wait.until(EC.presence_of_element_located((By.ID, "username")))

# Common Expected Conditions
wait.until(EC.element_to_be_clickable((By.ID, "submit")))
wait.until(EC.visibility_of_element_located((By.ID, "message")))
wait.until(EC.invisibility_of_element_located((By.ID, "loading")))
wait.until(EC.text_to_be_present_in_element((By.ID, "status"), "Success"))

# Fluent Wait (advanced)
wait = WebDriverWait(driver, 10, poll_frequency=1, 
                     ignored_exceptions=[NoSuchElementException])
```

**3. Page Object Model (POM)**

**Without POM (Bad Practice):**
```python
def test_login():
    driver.find_element(By.ID, "username").send_keys("john@example.com")
    driver.find_element(By.ID, "password").send_keys("password123")
    driver.find_element(By.ID, "login-btn").click()
    # Repeated in multiple tests - hard to maintain
```

**With POM (Best Practice):**
```python
class LoginPage:
    def __init__(self, driver):
        self.driver = driver
        self.username_input = (By.ID, "username")
        self.password_input = (By.ID, "password")
        self.login_button = (By.ID, "login-btn")
    
    def enter_username(self, username):
        self.driver.find_element(*self.username_input).send_keys(username)
    
    def enter_password(self, password):
        self.driver.find_element(*self.password_input).send_keys(password)
    
    def click_login(self):
        self.driver.find_element(*self.login_button).click()
    
    def login(self, username, password):
        self.enter_username(username)
        self.enter_password(password)
        self.click_login()

# In test file
def test_login():
    login_page = LoginPage(driver)
    login_page.login("john@example.com", "password123")
```

**4. Handling Common UI Elements**

```python
# Dropdowns
from selenium.webdriver.support.select import Select

dropdown = Select(driver.find_element(By.ID, "country"))
dropdown.select_by_visible_text("United States")
dropdown.select_by_value("us")
dropdown.select_by_index(2)

# Checkboxes & Radio Buttons
checkbox = driver.find_element(By.ID, "terms")
if not checkbox.is_selected():
    checkbox.click()

# Alerts
alert = driver.switch_to.alert
print(alert.text)
alert.accept()  # Click OK
alert.dismiss() # Click Cancel

# Frames/iFrames
driver.switch_to.frame("frame_name")
# Interact with elements inside frame
driver.switch_to.default_content()  # Switch back

# Multiple Windows
main_window = driver.current_window_handle
driver.switch_to.window(driver.window_handles[1])
driver.switch_to.window(main_window)

# JavaScript Execution
driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
driver.execute_script("arguments[0].click();", element)
```

**5. Advanced Actions**

```python
from selenium.webdriver.common.action_chains import ActionChains

actions = ActionChains(driver)

# Hover
actions.move_to_element(element).perform()

# Drag and Drop
actions.drag_and_drop(source_element, target_element).perform()

# Right Click
actions.context_click(element).perform()

# Double Click
actions.double_click(element).perform()

# Key Press
actions.key_down(Keys.CONTROL).send_keys('a').key_up(Keys.CONTROL).perform()
```

### Mobile Automation

#### Appium - Mobile Test Automation

**Setup Requirements:**
1. **Appium Server:** `npm install -g appium`
2. **Platform-Specific:**
   - **Android:** Android SDK, Android Studio, Java JDK
   - **iOS:** Xcode, Xcode Command Line Tools (Mac only)
3. **Appium Inspector:** GUI tool to inspect mobile app elements

**Desired Capabilities:**
```python
from appium import webdriver

# Android Example
desired_caps = {
    'platformName': 'Android',
    'platformVersion': '11',
    'deviceName': 'Pixel_5_API_30',
    'app': '/path/to/app.apk',
    'automationName': 'UiAutomator2',
    'appPackage': 'com.example.app',
    'appActivity': '.MainActivity'
}

# iOS Example
desired_caps = {
    'platformName': 'iOS',
    'platformVersion': '15.0',
    'deviceName': 'iPhone 13',
    'app': '/path/to/app.app',
    'automationName': 'XCUITest',
    'bundleId': 'com.example.app'
}

driver = webdriver.Remote('http://localhost:4723/wd/hub', desired_caps)
```

**Mobile Locators:**
```python
# Accessibility ID (recommended)
driver.find_element(By.ACCESSIBILITY_ID, "login-button")

# ID
driver.find_element(By.ID, "com.example.app:id/username")

# XPath
driver.find_element(By.XPATH, "//android.widget.Button[@text='Login']")

# Class Name
driver.find_element(By.CLASS_NAME, "android.widget.EditText")
```

**Mobile Gestures:**
```python
from appium.webdriver.common.touch_action import TouchAction

# Tap
TouchAction(driver).tap(element).perform()

# Swipe
driver.swipe(start_x=200, start_y=500, end_x=200, end_y=100, duration=1000)

# Scroll
driver.find_element(By.ANDROID_UIAUTOMATOR, 
    'new UiScrollable(new UiSelector()).scrollIntoView(text("Settings"))')

# Long Press
TouchAction(driver).long_press(element, duration=2000).release().perform()
```

### Framework Setup - Complete Example

**Project Structure:**
```
test_automation/
├── pages/
│   ├── __init__.py
│   ├── login_page.py
│   └── dashboard_page.py
├── tests/
│   ├── __init__.py
│   ├── test_login.py
│   └── test_dashboard.py
├── utilities/
│   ├── __init__.py
│   ├── driver_factory.py
│   └── config_reader.py
├── test_data/
│   └── users.json
├── reports/
├── requirements.txt
├── pytest.ini
└── README.md
```

> **Action Items:**
> - Explore **[Test Automation Frameworks](index.html?topic=test-automation-frameworks)** for framework design patterns
> - Practice building a complete automation framework from scratch
> - Learn about parallel execution with Selenium Grid or cloud services (BrowserStack, Sauce Labs)

---

## Phase 4: API and Services Testing

*Testing the backend is often more efficient and stable than UI testing.*

### What is API Testing?
Testing the business logic layer of the application without a user interface. It's faster, more stable, and allows for earlier testing in the development cycle.

**Why API Testing is Critical:**
- ⚡ **Faster:** No UI rendering, direct communication with backend
- 🎯 **More Stable:** No UI changes breaking tests
- 🔄 **Earlier Testing:** Can test before UI is ready
- 📊 **Better Coverage:** Can test edge cases and error scenarios easily
- 💰 **Cost-Effective:** Easier to maintain than UI tests

### Key API Concepts

#### HTTP Methods (CRUD Operations)

| Method | Purpose | Idempotent | Safe | Example |
|---|---|---|---|---|
| **GET** | Retrieve data | ✅ Yes | ✅ Yes | Get user details |
| **POST** | Create new resource | ❌ No | ❌ No | Create new user |
| **PUT** | Update/Replace resource | ✅ Yes | ❌ No | Update entire user |
| **PATCH** | Partial update | ❌ No | ❌ No | Update user email |
| **DELETE** | Remove resource | ✅ Yes | ❌ No | Delete user |
| **HEAD** | Get headers only | ✅ Yes | ✅ Yes | Check if resource exists |
| **OPTIONS** | Get allowed methods | ✅ Yes | ✅ Yes | Check CORS policy |

#### HTTP Status Codes

**Success Codes (2xx):**
- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `204 No Content` - Success with no response body

**Client Error (4xx):**
- `400 Bad Request` - Invalid request format
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - No permission
- `404 Not Found` - Resource doesn't exist
- `422 Unprocessable Entity` - Validation failed
- `429 Too Many Requests` - Rate limit exceeded

**Server Error (5xx):**
- `500 Internal Server Error` - Server crashed
- `502 Bad Gateway` - Invalid response from upstream
- `503 Service Unavailable` - Server temporarily down
- `504 Gateway Timeout` - Upstream timeout

#### Request/Response Structure

**Request:**
```
POST /api/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGc...

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response:**
```
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/users/123

{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2025-10-24T10:30:00Z"
}
```

#### Authentication Methods

**1. Basic Authentication:**
```python
response = requests.get(url, auth=('username', 'password'))
```

**2. API Key:**
```python
headers = {'X-API-Key': 'your-api-key-here'}
response = requests.get(url, headers=headers)
```

**3. Bearer Token (OAuth 2.0):**
```python
headers = {'Authorization': 'Bearer your-access-token'}
response = requests.get(url, headers=headers)
```

**4. OAuth 2.0 Flow:**
```python
# Step 1: Get access token
token_response = requests.post(
    'https://api.example.com/oauth/token',
    data={
        'grant_type': 'client_credentials',
        'client_id': 'your-client-id',
        'client_secret': 'your-client-secret'
    }
)
access_token = token_response.json()['access_token']

# Step 2: Use access token
headers = {'Authorization': f'Bearer {access_token}'}
response = requests.get(url, headers=headers)
```

### API Testing Tools

#### Python with Requests

**Installation:**
```bash
pip install requests pytest
```

**Complete Test Example:**
```python
import requests
import pytest

BASE_URL = "https://reqres.in/api"

class TestUserAPI:
    
    @pytest.fixture
    def create_user(self):
        """Fixture to create a test user"""
        payload = {
            "name": "John Doe",
            "job": "SDET"
        }
        response = requests.post(f"{BASE_URL}/users", json=payload)
        return response.json()
    
    def test_get_users_list(self):
        """Test GET - Retrieve users list"""
        response = requests.get(f"{BASE_URL}/users?page=2")
        
        # Status code validation
        assert response.status_code == 200
        
        # Response time validation
        assert response.elapsed.total_seconds() < 2
        
        # JSON schema validation
        data = response.json()
        assert 'data' in data
        assert 'page' in data
        assert data['page'] == 2
        
        # Data validation
        assert len(data['data']) > 0
        first_user = data['data'][0]
        assert 'id' in first_user
        assert 'email' in first_user
        assert '@' in first_user['email']
    
    def test_get_single_user(self):
        """Test GET - Retrieve single user"""
        user_id = 2
        response = requests.get(f"{BASE_URL}/users/{user_id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data['data']['id'] == user_id
        assert data['data']['email'] == "janet.weaver@reqres.in"
    
    def test_create_user(self):
        """Test POST - Create new user"""
        payload = {
            "name": "John Doe",
            "job": "SDET Engineer"
        }
        response = requests.post(f"{BASE_URL}/users", json=payload)
        
        assert response.status_code == 201
        data = response.json()
        assert data['name'] == payload['name']
        assert data['job'] == payload['job']
        assert 'id' in data
        assert 'createdAt' in data
    
    def test_update_user(self, create_user):
        """Test PUT - Update user"""
        user_id = create_user['id']
        payload = {
            "name": "Jane Doe",
            "job": "Senior SDET"
        }
        response = requests.put(f"{BASE_URL}/users/{user_id}", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert data['name'] == payload['name']
        assert data['job'] == payload['job']
        assert 'updatedAt' in data
    
    def test_delete_user(self):
        """Test DELETE - Remove user"""
        user_id = 2
        response = requests.delete(f"{BASE_URL}/users/{user_id}")
        
        assert response.status_code == 204
    
    def test_user_not_found(self):
        """Test GET - Non-existent user"""
        response = requests.get(f"{BASE_URL}/users/9999")
        assert response.status_code == 404
    
    def test_invalid_request(self):
        """Test POST - Invalid payload"""
        payload = {}  # Empty payload
        response = requests.post(f"{BASE_URL}/users", json=payload)
        
        # Note: This API doesn't validate, but in real scenarios
        # you'd expect 400 or 422
        assert response.status_code in [200, 201, 400, 422]
```

#### Java with REST-Assured

**Maven Dependency:**
```xml
<dependency>
    <groupId>io.rest-assured</groupId>
    <artifactId>rest-assured</artifactId>
    <version>5.3.0</version>
    <scope>test</scope>
</dependency>
```

**Test Example:**
```java
import io.restassured.RestAssured;
import io.restassured.response.Response;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class UserAPITest {
    
    @BeforeClass
    public void setup() {
        RestAssured.baseURI = "https://reqres.in/api";
    }
    
    @Test
    public void testGetUsersList() {
        given()
            .queryParam("page", 2)
        .when()
            .get("/users")
        .then()
            .statusCode(200)
            .time(lessThan(2000L))
            .body("page", equalTo(2))
            .body("data.size()", greaterThan(0))
            .body("data[0].email", containsString("@"));
    }
    
    @Test
    public void testCreateUser() {
        String requestBody = """
            {
                "name": "John Doe",
                "job": "SDET Engineer"
            }
            """;
        
        given()
            .contentType("application/json")
            .body(requestBody)
        .when()
            .post("/users")
        .then()
            .statusCode(201)
            .body("name", equalTo("John Doe"))
            .body("job", equalTo("SDET Engineer"))
            .body("id", notNullValue())
            .body("createdAt", notNullValue());
    }
    
    @Test
    public void testUpdateUser() {
        String requestBody = """
            {
                "name": "Jane Doe",
                "job": "Senior SDET"
            }
            """;
        
        given()
            .contentType("application/json")
            .body(requestBody)
        .when()
            .put("/users/2")
        .then()
            .statusCode(200)
            .body("name", equalTo("Jane Doe"))
            .body("updatedAt", notNullValue());
    }
}
```

### Advanced API Testing Concepts

#### JSON Schema Validation
```python
from jsonschema import validate

user_schema = {
    "type": "object",
    "properties": {
        "id": {"type": "integer"},
        "email": {"type": "string", "format": "email"},
        "first_name": {"type": "string"},
        "last_name": {"type": "string"},
    },
    "required": ["id", "email"]
}

response = requests.get(f"{BASE_URL}/users/2")
user_data = response.json()['data']
validate(instance=user_data, schema=user_schema)  # Raises error if invalid
```

#### Data-Driven API Testing
```python
import pytest

@pytest.mark.parametrize("user_id,expected_email", [
    (1, "george.bluth@reqres.in"),
    (2, "janet.weaver@reqres.in"),
    (3, "emma.wong@reqres.in"),
])
def test_get_user_emails(user_id, expected_email):
    response = requests.get(f"{BASE_URL}/users/{user_id}")
    assert response.json()['data']['email'] == expected_email
```

#### Mocking External APIs
```python
from unittest.mock import patch, Mock

@patch('requests.get')
def test_with_mock(mock_get):
    # Setup mock response
    mock_response = Mock()
    mock_response.status_code = 200
    mock_response.json.return_value = {'id': 1, 'name': 'Test User'}
    mock_get.return_value = mock_response
    
    # Your test code
    response = requests.get('https://api.example.com/users/1')
    assert response.json()['name'] == 'Test User'
```

### API Test Strategy

**What to Test:**
1. ✅ **Status Codes:** Correct codes for success/failure scenarios
2. ✅ **Response Time:** Performance within acceptable limits
3. ✅ **Response Data:** Correct data structure and values
4. ✅ **Headers:** Content-Type, Cache-Control, CORS headers
5. ✅ **Authentication:** Proper access control
6. ✅ **Error Handling:** Meaningful error messages
7. ✅ **Data Validation:** Field types, formats, ranges
8. ✅ **Business Logic:** Calculations, workflows, state transitions
9. ✅ **Edge Cases:** Boundary values, null/empty values
10. ✅ **Security:** SQL injection, XSS, unauthorized access

> **Action Items:**
> - Deep dive into **[API Testing Guide](index.html?topic=api-testing)** for comprehensive examples
> - Practice with public APIs: [JSONPlaceholder](https://jsonplaceholder.typicode.com/), [ReqRes](https://reqres.in/)
> - Learn contract testing with tools like Pact
> - Explore GraphQL testing if your project uses it

---

## Phase 5: DevOps and CI/CD Integration

*An SDET ensures quality is built into the development pipeline, not just checked at the end.*

### What is CI/CD?

**Continuous Integration (CI):**
- Developers merge code changes into a central repository frequently (multiple times per day)
- Automated builds and tests run on every commit
- Catches integration issues early
- Provides fast feedback to developers

**Continuous Delivery (CD):**
- Automatically releasing code changes to testing/staging environments
- Code is always in a deployable state
- Manual approval for production deployment

**Continuous Deployment:**
- Fully automated - code goes to production automatically after passing all tests
- No manual intervention
- Requires high confidence in automated tests

### SDET's Critical Role in CI/CD

1. **Test Automation:** Create and maintain automated test suites
2. **Quality Gates:** Define pass/fail criteria at each pipeline stage
3. **Test Environment Management:** Ensure test environments are stable and consistent
4. **Flaky Test Management:** Identify and fix unreliable tests
5. **Test Reporting:** Provide clear, actionable test results
6. **Performance Monitoring:** Ensure pipelines run efficiently
7. **Tool Integration:** Integrate testing tools into CI/CD platform

### Essential Git Commands

**Basic Workflow:**
```bash
# Clone repository
git clone https://github.com/user/repo.git

# Check status
git status

# Create a new branch
git checkout -b feature/new-test

# Stage changes
git add test_login.py
git add .  # Add all changes

# Commit changes
git commit -m "Add login test cases"

# Push to remote
git push origin feature/new-test

# Pull latest changes
git pull origin main

# Merge branch
git checkout main
git merge feature/new-test

# Delete branch
git branch -d feature/new-test
```

**Advanced Git:**
```bash
# Rebase (cleaner history)
git rebase main

# Interactive rebase (squash commits)
git rebase -i HEAD~3

# Stash changes
git stash
git stash pop

# Cherry-pick specific commit
git cherry-pick abc123

# View commit history
git log --oneline --graph --all

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# View differences
git diff
git diff main feature/new-test
```

### CI/CD Tools & Platforms

#### Jenkins

**Jenkinsfile Example (Declarative Pipeline):**
```groovy
pipeline {
    agent any
    
    environment {
        TEST_ENV = 'staging'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                    url: 'https://github.com/user/repo.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'pip install -r requirements.txt'
            }
        }
        
        stage('Lint & Code Quality') {
            steps {
                sh 'flake8 tests/'
                sh 'pylint tests/'
            }
        }
        
        stage('Unit Tests') {
            steps {
                sh 'pytest tests/unit/ --junitxml=reports/unit-tests.xml'
            }
        }
        
        stage('API Tests') {
            steps {
                sh 'pytest tests/api/ --junitxml=reports/api-tests.xml'
            }
        }
        
        stage('UI Tests') {
            parallel {
                stage('Chrome') {
                    steps {
                        sh 'pytest tests/ui/ --browser=chrome'
                    }
                }
                stage('Firefox') {
                    steps {
                        sh 'pytest tests/ui/ --browser=firefox'
                    }
                }
            }
        }
        
        stage('Generate Reports') {
            steps {
                junit 'reports/*.xml'
                publishHTML([
                    reportDir: 'reports/html',
                    reportFiles: 'index.html',
                    reportName: 'Test Report'
                ])
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            emailext subject: "✅ Build Passed: ${env.JOB_NAME}",
                     body: "Build #${env.BUILD_NUMBER} passed successfully",
                     to: 'team@example.com'
        }
        failure {
            emailext subject: "❌ Build Failed: ${env.JOB_NAME}",
                     body: "Build #${env.BUILD_NUMBER} failed. Check console output",
                     to: 'team@example.com'
        }
    }
}
```

#### GitHub Actions

**.github/workflows/test.yml:**
```yaml
name: Test Automation

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * *'  # Run daily at 2 AM

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        python-version: [3.9, 3.10, 3.11]
        browser: [chrome, firefox]
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: ${{ matrix.python-version }}
    
    - name: Cache dependencies
      uses: actions/cache@v3
      with:
        path: ~/.cache/pip
        key: ${{ runner.os }}-pip-${{ hashFiles('requirements.txt') }}
    
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
        pip install pytest pytest-html pytest-xdist
    
    - name: Run API tests
      run: pytest tests/api/ -v --html=reports/api-report.html
    
    - name: Run UI tests
      run: pytest tests/ui/ -v --browser=${{ matrix.browser }}
      env:
        BASE_URL: ${{ secrets.TEST_URL }}
        API_KEY: ${{ secrets.API_KEY }}
    
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: test-results-${{ matrix.python-version }}-${{ matrix.browser }}
        path: reports/
    
    - name: Publish test results
      uses: EnricoMi/publish-unit-test-result-action@v2
      if: always()
      with:
        files: reports/*.xml
```

#### GitLab CI

**.gitlab-ci.yml:**
```yaml
stages:
  - test
  - deploy

variables:
  PIP_CACHE_DIR: "$CI_PROJECT_DIR/.cache/pip"

cache:
  paths:
    - .cache/pip

before_script:
  - pip install -r requirements.txt

unit_tests:
  stage: test
  script:
    - pytest tests/unit/ --junitxml=report.xml
  artifacts:
    reports:
      junit: report.xml

api_tests:
  stage: test
  script:
    - pytest tests/api/ --junitxml=report.xml
  artifacts:
    reports:
      junit: report.xml

ui_tests:
  stage: test
  parallel:
    matrix:
      - BROWSER: [chrome, firefox]
  script:
    - pytest tests/ui/ --browser=$BROWSER
  only:
    - main
    - merge_requests
```

### Docker for Test Environments

**Dockerfile:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install Chrome and ChromeDriver
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    chromium \
    chromium-driver

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy test code
COPY tests/ ./tests/
COPY conftest.py .

# Run tests
CMD ["pytest", "tests/", "-v", "--html=reports/report.html"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  selenium-hub:
    image: selenium/hub:latest
    ports:
      - "4444:4444"
  
  chrome:
    image: selenium/node-chrome:latest
    depends_on:
      - selenium-hub
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
  
  firefox:
    image: selenium/node-firefox:latest
    depends_on:
      - selenium-hub
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
  
  tests:
    build: .
    depends_on:
      - selenium-hub
    environment:
      - SELENIUM_HUB=http://selenium-hub:4444/wd/hub
    volumes:
      - ./reports:/app/reports
```

### Quality Gates & Metrics

**Define Quality Criteria:**
```yaml
quality_gates:
  test_pass_rate: 95%
  code_coverage: 80%
  performance_threshold: 2s
  security_vulnerabilities: 0
  flaky_test_rate: < 5%
```

**Key Metrics to Track:**
- **Test Pass Rate:** % of tests passing
- **Test Execution Time:** Time to run test suite
- **Code Coverage:** % of code covered by tests
- **Defect Escape Rate:** Bugs found in production
- **Mean Time to Detect (MTTD):** Time to find a bug
- **Mean Time to Resolve (MTTR):** Time to fix a bug

### Complete CI/CD Pipeline Flow

```
┌─────────────┐
│ Code Commit │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Build     │ ← Compile code, install dependencies
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Lint/SAST  │ ← Code quality, security scanning
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Unit Tests  │ ← Fast, isolated tests
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Deploy to   │
│   Staging   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  API Tests  │ ← Integration tests
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  UI Tests   │ ← End-to-end tests
└──────┬──────┘
       │
       ▼
┌─────────────┐
│Performance  │ ← Load/stress tests
│   Tests     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Security   │ ← DAST, penetration tests
│   Tests     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Deploy    │ ← Manual approval
│ Production  │
└─────────────┘
```

> **Action Items:**
> - Study **[Git & GitHub Actions](index.html?topic=git-github-actions)** for version control mastery
> - Explore **[CI/CD Pipelines](index.html?topic=ci-cd-pipelines)** for implementation details
> - Set up a personal GitHub repository with CI/CD pipeline
> - Learn Docker basics and containerize your test framework

---

## Phase 6: Advanced Automation Concepts

*Move from writing scripts to building scalable, maintainable automation solutions.*

### Test Automation Framework Architecture

A robust test automation framework consists of multiple layers and components working together.

**Framework Layers:**
```
┌─────────────────────────────────────┐
│     Test Layer (Test Cases)         │
├─────────────────────────────────────┤
│   Page Object Layer (UI Elements)   │
├─────────────────────────────────────┤
│    Business Logic Layer (Actions)   │
├─────────────────────────────────────┤
│   Utilities Layer (Helpers, Utils)  │
├─────────────────────────────────────┤
│  Configuration Layer (Settings)     │
├─────────────────────────────────────┤
│   Data Layer (Test Data, Fixtures)  │
└─────────────────────────────────────┘
```

**Key Components:**
1. **Test Runner:** (Pytest, TestNG, JUnit, NUnit) - Executes tests and provides assertions
2. **Reporting:** (Allure, ExtentReports, ReportPortal) - Generates detailed test execution reports
3. **Configuration Management:** Environment URLs, credentials, browser settings
4. **Logging:** Comprehensive logging for debugging (Python logging, Log4j)
5. **Utilities:** Reusable functions for database, API, file operations
6. **Test Data Management:** External files (CSV, JSON, Excel) or databases
7. **Screenshot/Video Capture:** For failure analysis
8. **Retry Mechanism:** Rerun failed tests to handle flakiness

### Framework Types

#### 1. Linear Framework (❌ Not Recommended)
**Description:** Record and playback. No reusability.
**Use Case:** Quick proof of concept only.

#### 2. Modular Framework
**Description:** Breaking down application into modules, each with its own test scripts.
```
tests/
├── login_tests.py
├── checkout_tests.py
└── profile_tests.py
```

#### 3. Data-Driven Framework
**Description:** Test logic separated from test data. Same test runs with multiple datasets.

**Example with CSV:**
```python
# test_data.csv
username,password,expected_result
valid@test.com,Pass123,success
invalid@test.com,wrong,failure
empty@test.com,,failure

# test_login.py
import pytest
import csv

def read_test_data():
    with open('test_data.csv') as f:
        reader = csv.DictReader(f)
        return list(reader)

@pytest.mark.parametrize("data", read_test_data())
def test_login(data):
    # Test logic using data['username'], data['password']
    pass
```

#### 4. Keyword-Driven Framework
**Description:** Test cases defined using keywords (actions). Good for non-technical users.

```python
# keywords.py
def navigate_to(url):
    driver.get(url)

def click_button(locator):
    driver.find_element(*locator).click()

def enter_text(locator, text):
    driver.find_element(*locator).send_keys(text)

# test_keywords.csv
Action,Object,Data
navigate_to,https://example.com,
enter_text,username_field,john@test.com
enter_text,password_field,Pass123
click_button,login_button,
```

#### 5. Hybrid Framework (✅ Recommended)
**Description:** Combination of multiple frameworks. Most flexible and powerful.

**Complete Framework Structure:**
```
test_framework/
├── config/
│   ├── __init__.py
│   ├── config.yaml
│   └── environments.json
├── pages/
│   ├── __init__.py
│   ├── base_page.py
│   ├── login_page.py
│   └── dashboard_page.py
├── tests/
│   ├── __init__.py
│   ├── test_login.py
│   ├── test_checkout.py
│   └── test_api.py
├── test_data/
│   ├── users.json
│   ├── products.csv
│   └── test_data.xlsx
├── utilities/
│   ├── __init__.py
│   ├── driver_factory.py
│   ├── logger.py
│   ├── database_helper.py
│   ├── api_helper.py
│   └── excel_reader.py
├── reports/
│   ├── screenshots/
│   └── logs/
├── requirements.txt
├── pytest.ini
├── conftest.py
└── README.md
```

### Design Patterns in Test Automation

#### 1. Page Object Model (POM) ⭐ Most Important

**Benefits:**
- Reduces code duplication
- Improves maintainability
- Makes tests more readable
- Easy to update when UI changes

**Implementation:**
```python
# pages/base_page.py
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class BasePage:
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, 10)
    
    def find_element(self, locator):
        return self.wait.until(EC.presence_of_element_located(locator))
    
    def click(self, locator):
        self.wait.until(EC.element_to_be_clickable(locator)).click()
    
    def enter_text(self, locator, text):
        element = self.find_element(locator)
        element.clear()
        element.send_keys(text)

# pages/login_page.py
from selenium.webdriver.common.by import By
from pages.base_page import BasePage

class LoginPage(BasePage):
    # Locators
    USERNAME = (By.ID, "username")
    PASSWORD = (By.ID, "password")
    LOGIN_BTN = (By.CSS_SELECTOR, "button[type='submit']")
    ERROR_MSG = (By.CLASS_NAME, "error-message")
    
    def __init__(self, driver):
        super().__init__(driver)
        self.driver.get("https://example.com/login")
    
    def enter_username(self, username):
        self.enter_text(self.USERNAME, username)
        return self
    
    def enter_password(self, password):
        self.enter_text(self.PASSWORD, password)
        return self
    
    def click_login_button(self):
        self.click(self.LOGIN_BTN)
        return self
    
    def get_error_message(self):
        return self.find_element(self.ERROR_MSG).text
    
    def login(self, username, password):
        self.enter_username(username)
        self.enter_password(password)
        self.click_login_button()
        return DashboardPage(self.driver)

# tests/test_login.py
def test_valid_login(driver):
    login_page = LoginPage(driver)
    dashboard = login_page.login("user@test.com", "Pass123")
    assert dashboard.is_loaded()

def test_invalid_login(driver):
    login_page = LoginPage(driver)
    login_page.login("invalid@test.com", "wrong")
    error = login_page.get_error_message()
    assert "Invalid credentials" in error
```

#### 2. Factory Pattern

**Used for:** Creating driver instances, test data objects

```python
# utilities/driver_factory.py
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.firefox.options import Options as FirefoxOptions

class DriverFactory:
    @staticmethod
    def get_driver(browser="chrome", headless=False):
        if browser.lower() == "chrome":
            options = ChromeOptions()
            if headless:
                options.add_argument("--headless")
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            return webdriver.Chrome(options=options)
        
        elif browser.lower() == "firefox":
            options = FirefoxOptions()
            if headless:
                options.add_argument("--headless")
            return webdriver.Firefox(options=options)
        
        elif browser.lower() == "edge":
            return webdriver.Edge()
        
        else:
            raise ValueError(f"Unsupported browser: {browser}")

# Usage in conftest.py
@pytest.fixture
def driver(request):
    browser = request.config.getoption("--browser")
    driver = DriverFactory.get_driver(browser)
    driver.maximize_window()
    yield driver
    driver.quit()
```

#### 3. Singleton Pattern

**Used for:** Database connections, configuration readers

```python
class ConfigReader:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._load_config()
        return cls._instance
    
    def _load_config(self):
        with open('config/config.json') as f:
            self.config = json.load(f)
    
    def get(self, key):
        return self.config.get(key)

# Usage - always returns same instance
config1 = ConfigReader()
config2 = ConfigReader()
assert config1 is config2  # True
```

#### 4. Strategy Pattern

**Used for:** Different test execution strategies

```python
class TestExecutionStrategy:
    def execute(self, tests):
        raise NotImplementedError

class SequentialStrategy(TestExecutionStrategy):
    def execute(self, tests):
        for test in tests:
            test.run()

class ParallelStrategy(TestExecutionStrategy):
    def execute(self, tests):
        with ThreadPoolExecutor() as executor:
            executor.map(lambda t: t.run(), tests)

class TestRunner:
    def __init__(self, strategy: TestExecutionStrategy):
        self.strategy = strategy
    
    def run_tests(self, tests):
        self.strategy.execute(tests)
```

### Advanced Testing Techniques

#### Parallel Test Execution

**Pytest with xdist:**
```bash
# Run tests in parallel (4 processes)
pytest -n 4

# Run tests in parallel (auto-detect CPU count)
pytest -n auto
```

**TestNG Parallel Execution:**
```xml
<suite name="Parallel Test Suite" parallel="methods" thread-count="5">
    <test name="Test 1">
        <classes>
            <class name="com.tests.LoginTest"/>
            <class name="com.tests.CheckoutTest"/>
        </classes>
    </test>
</suite>
```

#### Retry Failed Tests

**Pytest retry plugin:**
```bash
pip install pytest-rerunfailures

# Retry failed tests 3 times
pytest --reruns 3 --reruns-delay 2
```

**In code:**
```python
@pytest.mark.flaky(reruns=3, reruns_delay=2)
def test_flaky_feature():
    # Test code
    pass
```

#### Screenshot on Failure

```python
# conftest.py
import pytest
from datetime import datetime

@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()
    
    if report.when == "call" and report.failed:
        driver = item.funcargs.get('driver')
        if driver:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"reports/screenshots/{item.name}_{timestamp}.png"
            driver.save_screenshot(filename)
            print(f"\nScreenshot saved: {filename}")
```

> **Action Items:**
> - Study the **[Test Automation Frameworks](index.html?topic=test-automation-frameworks)** guide
> - Build a complete hybrid framework from scratch
> - Implement all design patterns in your framework
> - Add parallel execution and retry mechanisms

---

## Phase 7: Non-Functional Testing

*Go beyond "does it work?" to "how well does it work?".*

### Performance Testing

**Goal:** Evaluate the speed, responsiveness, stability, and scalability of an application under various workload conditions.

#### Types of Performance Testing

| Type | Purpose | Example Scenario |
|---|---|---|
| **Load Testing** | Test behavior under expected load | 1000 concurrent users |
| **Stress Testing** | Find breaking point | Increase users until system fails |
| **Spike Testing** | Sudden increase in load | Black Friday sales |
| **Endurance/Soak Testing** | Long duration testing | 24-hour continuous load |
| **Scalability Testing** | Test scaling capability | Add servers, measure improvement |
| **Volume Testing** | Large data volumes | Database with 1M records |

#### Key Performance Metrics

| Metric | Description | Good Target |
|---|---|---|
| **Response Time** | Time to respond to a request | < 2 seconds |
| **Throughput** | Requests handled per second | Depends on system |
| **Error Rate** | % of failed requests | < 1% |
| **CPU Usage** | Server CPU utilization | < 80% |
| **Memory Usage** | RAM consumption | < 85% |
| **Network Bandwidth** | Data transferred | Monitor saturation |

#### JMeter - Getting Started

**Installation:**
```bash
# Download from https://jmeter.apache.org/
# Extract and run
./apache-jmeter-x.x/bin/jmeter
```

**Basic Test Plan Structure:**
```
Test Plan
├── Thread Group (Users)
│   ├── HTTP Request (API call)
│   ├── HTTP Header Manager
│   └── Assertions
├── Listeners (View Results)
│   ├── View Results Tree
│   ├── Summary Report
│   └── Aggregate Report
└── CSV Data Set Config (Test Data)
```

**Example: API Load Test Script (JMeter CLI):**
```bash
# Run test with 100 threads for 60 seconds
jmeter -n -t test_plan.jmx -l results.jtl -e -o report_folder \
  -Jthreads=100 -Jduration=60 -Jrampup=10
```

#### k6 - Modern Performance Testing

**Installation:**
```bash
# Windows
choco install k6

# Mac
brew install k6

# Linux
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

**Example k6 Script:**
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% requests < 500ms
    http_req_failed: ['rate<0.01'],    // Error rate < 1%
  },
};

export default function () {
  // Test GET request
  let response = http.get('https://api.example.com/users');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  // Test POST request
  let payload = JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
  });
  
  let params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer token123',
    },
  };
  
  response = http.post('https://api.example.com/users', payload, params);
  
  check(response, {
    'status is 201': (r) => r.status === 201,
  });
  
  sleep(1);  // Think time
}
```

**Run k6 Test:**
```bash
# Run locally
k6 run script.js

# Run with custom VUs and duration
k6 run --vus 50 --duration 30s script.js

# Run in cloud
k6 cloud script.js
```

#### Gatling - Code-Based Performance Testing

**Scala Script Example:**
```scala
import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._

class BasicSimulation extends Simulation {
  
  val httpProtocol = http
    .baseUrl("https://api.example.com")
    .acceptHeader("application/json")
    .userAgentHeader("Mozilla/5.0")
  
  val scn = scenario("Basic Scenario")
    .exec(http("Get Users")
      .get("/users")
      .check(status.is(200)))
    .pause(2)
    .exec(http("Create User")
      .post("/users")
      .body(StringBody("""{"name":"Test","email":"test@example.com"}"""))
      .asJson
      .check(status.is(201)))
  
  setUp(
    scn.inject(
      atOnceUsers(10),
      rampUsers(50) during (30 seconds)
    )
  ).protocols(httpProtocol)
}
```

### Security Testing

**Goal:** Identify vulnerabilities and protect the application from security threats.

#### OWASP Top 10 (2021) - Must Know

| Rank | Vulnerability | Description | Example |
|---|---|---|---|
| 1 | **Broken Access Control** | Users can access unauthorized resources | Regular user accessing admin panel |
| 2 | **Cryptographic Failures** | Weak encryption or exposed sensitive data | Passwords stored in plain text |
| 3 | **Injection** | Untrusted data sent to interpreter | SQL Injection, Command Injection |
| 4 | **Insecure Design** | Missing or ineffective security controls | No rate limiting on login |
| 5 | **Security Misconfiguration** | Insecure default configs, incomplete setups | Default credentials enabled |
| 6 | **Vulnerable Components** | Using outdated/vulnerable libraries | Old version of Log4j |
| 7 | **Authentication Failures** | Broken authentication and session management | Weak password policy |
| 8 | **Software & Data Integrity** | Code and infrastructure without integrity verification | Unsigned updates |
| 9 | **Security Logging Failures** | Insufficient logging and monitoring | No audit trail |
| 10 | **Server-Side Request Forgery** | App fetches remote resource without validation | SSRF attacks |

#### Common Security Tests to Automate

**1. SQL Injection Testing:**
```python
def test_sql_injection_protection():
    malicious_inputs = [
        "' OR '1'='1",
        "1; DROP TABLE users--",
        "admin'--",
        "' UNION SELECT * FROM users--"
    ]
    
    for payload in malicious_inputs:
        response = requests.post('/login', data={
            'username': payload,
            'password': 'test'
        })
        # Should not return 200 or expose data
        assert response.status_code in [400, 403]
        assert 'error' in response.json()
```

**2. XSS (Cross-Site Scripting) Testing:**
```python
def test_xss_protection():
    xss_payloads = [
        "<script>alert('XSS')</script>",
        "<img src=x onerror=alert('XSS')>",
        "javascript:alert('XSS')"
    ]
    
    for payload in xss_payloads:
        response = requests.post('/comments', data={'text': payload})
        # Response should sanitize the input
        assert '<script>' not in response.text
        assert 'onerror=' not in response.text
```

**3. Authentication & Authorization Testing:**
```python
def test_unauthorized_access():
    # Try accessing protected resource without token
    response = requests.get('/api/admin/users')
    assert response.status_code == 401
    
    # Try accessing with regular user token
    user_token = get_user_token()
    headers = {'Authorization': f'Bearer {user_token}'}
    response = requests.get('/api/admin/users', headers=headers)
    assert response.status_code == 403

def test_jwt_token_expiration():
    expired_token = "eyJhbGc..."  # Expired JWT token
    headers = {'Authorization': f'Bearer {expired_token}'}
    response = requests.get('/api/protected', headers=headers)
    assert response.status_code == 401
    assert 'expired' in response.json()['error'].lower()
```

#### OWASP ZAP - Automated Security Scanning

**Installation:**
```bash
# Download from https://www.zaproxy.org/download/
# Or use Docker
docker run -u zap -p 8080:8080 -p 8090:8090 owasp/zap2docker-stable zap-webswing.sh
```

**Python Integration:**
```python
from zapv2 import ZAPv2

# Connect to ZAP
zap = ZAPv2(apikey='your-api-key', proxies={'http': 'http://127.0.0.1:8080'})

# Spider the target
target = 'http://example.com'
print('Spidering target...')
scan_id = zap.spider.scan(target)
while int(zap.spider.status(scan_id)) < 100:
    print(f'Spider progress: {zap.spider.status(scan_id)}%')
    time.sleep(2)

# Active scan
print('Scanning target...')
scan_id = zap.ascan.scan(target)
while int(zap.ascan.status(scan_id)) < 100:
    print(f'Scan progress: {zap.ascan.status(scan_id)}%')
    time.sleep(5)

# Get alerts
alerts = zap.core.alerts(baseurl=target)
print(f'Found {len(alerts)} security issues')

# Generate report
with open('security_report.html', 'w') as f:
    f.write(zap.core.htmlreport())
```

### Accessibility Testing

**Goal:** Ensure applications are usable by people with disabilities.

**WCAG 2.1 Levels:**
- **Level A:** Minimum accessibility
- **Level AA:** Acceptable accessibility (most common target)
- **Level AAA:** Optimal accessibility

**Automated Testing with Axe:**
```python
from selenium import webdriver
from axe_selenium_python import Axe

def test_accessibility():
    driver = webdriver.Chrome()
    driver.get("https://example.com")
    
    axe = Axe(driver)
    axe.inject()
    results = axe.run()
    
    # Assert no violations
    assert len(results["violations"]) == 0, \
        f"Found {len(results['violations'])} accessibility issues"
    
    # Write report
    axe.write_results(results, "accessibility_report.json")
    driver.quit()
```

> **Pro Tip:** Non-functional testing should be integrated into CI/CD pipelines, not just done manually before releases.

---

## Phase 8: Database Testing

*Understanding and validating data layer is crucial for SDETs.*

### Why Database Testing Matters

- 🎯 **Data Integrity:** Ensure data is stored correctly
- 🔄 **CRUD Operations:** Validate Create, Read, Update, Delete
- ⚡ **Performance:** Check query optimization and response times
- 🔐 **Security:** Test for SQL injection, unauthorized access
- 📊 **Data Migration:** Validate schema changes and data migrations

### SQL Fundamentals for SDETs

#### Basic SQL Commands

```sql
-- SELECT: Retrieve data
SELECT * FROM users WHERE age > 18;
SELECT name, email FROM users WHERE status = 'active';
SELECT COUNT(*) FROM orders WHERE order_date = '2025-10-24';

-- INSERT: Add new data
INSERT INTO users (name, email, age) VALUES ('John Doe', 'john@test.com', 30);

-- UPDATE: Modify existing data
UPDATE users SET status = 'inactive' WHERE last_login < '2024-01-01';

-- DELETE: Remove data
DELETE FROM users WHERE email = 'test@example.com';

-- JOINS: Combine tables
SELECT u.name, o.order_id, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- Aggregations
SELECT country, COUNT(*) as user_count, AVG(age) as avg_age
FROM users
GROUP BY country
HAVING COUNT(*) > 10;
```

### Database Testing with Python

**Installation:**
```bash
pip install pymysql psycopg2 pymongo sqlalchemy
```

#### MySQL/PostgreSQL Testing

```python
import pymysql
import pytest

class DatabaseHelper:
    def __init__(self, host, user, password, database):
        self.connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            database=database
        )
        self.cursor = self.connection.cursor()
    
    def execute_query(self, query, params=None):
        self.cursor.execute(query, params)
        return self.cursor.fetchall()
    
    def execute_update(self, query, params=None):
        self.cursor.execute(query, params)
        self.connection.commit()
        return self.cursor.rowcount
    
    def close(self):
        self.cursor.close()
        self.connection.close()

# Test Examples
class TestUserDatabase:
    
    @pytest.fixture
    def db(self):
        db = DatabaseHelper('localhost', 'root', 'password', 'testdb')
        yield db
        db.close()
    
    def test_user_insertion(self, db):
        """Test inserting a new user"""
        query = "INSERT INTO users (name, email) VALUES (%s, %s)"
        rows_affected = db.execute_update(query, ('Test User', 'test@example.com'))
        assert rows_affected == 1
        
        # Verify insertion
        result = db.execute_query("SELECT * FROM users WHERE email = %s", ('test@example.com',))
        assert len(result) == 1
        assert result[0][1] == 'Test User'
    
    def test_data_integrity(self, db):
        """Test data constraints"""
        # Duplicate email should fail
        query = "INSERT INTO users (name, email) VALUES (%s, %s)"
        db.execute_update(query, ('User1', 'duplicate@test.com'))
        
        with pytest.raises(Exception):  # Should raise IntegrityError
            db.execute_update(query, ('User2', 'duplicate@test.com'))
    
    def test_cascade_delete(self, db):
        """Test cascade deletes work correctly"""
        # Create user and orders
        user_id = 123
        db.execute_update("DELETE FROM users WHERE id = %s", (user_id,))
        
        # Verify orders are also deleted
        orders = db.execute_query("SELECT * FROM orders WHERE user_id = %s", (user_id,))
        assert len(orders) == 0
    
    def test_query_performance(self, db):
        """Test query execution time"""
        import time
        
        start_time = time.time()
        result = db.execute_query("SELECT * FROM users WHERE age > 18")
        execution_time = time.time() - start_time
        
        assert execution_time < 1.0, f"Query too slow: {execution_time}s"
```

#### MongoDB Testing

```python
from pymongo import MongoClient
import pytest

class MongoDBHelper:
    def __init__(self, host='localhost', port=27017, database='testdb'):
        self.client = MongoClient(host, port)
        self.db = self.client[database]
    
    def insert_document(self, collection, document):
        return self.db[collection].insert_one(document)
    
    def find_documents(self, collection, query):
        return list(self.db[collection].find(query))
    
    def update_document(self, collection, query, update):
        return self.db[collection].update_one(query, {'$set': update})
    
    def delete_documents(self, collection, query):
        return self.db[collection].delete_many(query)
    
    def close(self):
        self.client.close()

# Test Examples
def test_mongodb_operations():
    mongo = MongoDBHelper()
    collection = 'users'
    
    # Insert
    user = {'name': 'John', 'email': 'john@test.com', 'age': 30}
    result = mongo.insert_document(collection, user)
    assert result.inserted_id is not None
    
    # Find
    users = mongo.find_documents(collection, {'email': 'john@test.com'})
    assert len(users) > 0
    
    # Update
    update_result = mongo.update_document(
        collection,
        {'email': 'john@test.com'},
        {'age': 31}
    )
    assert update_result.modified_count == 1
    
    # Delete
    delete_result = mongo.delete_documents(collection, {'email': 'john@test.com'})
    assert delete_result.deleted_count > 0
    
    mongo.close()
```

### Database Testing Checklist

- ✅ **Schema Validation:** Verify table structures, columns, data types
- ✅ **CRUD Operations:** Test all database operations
- ✅ **Constraints:** Primary keys, foreign keys, unique constraints
- ✅ **Stored Procedures:** Test custom database functions
- ✅ **Triggers:** Verify automatic actions work correctly
- ✅ **Indexes:** Check query optimization with indexes
- ✅ **Transactions:** Test ACID properties
- ✅ **Data Migration:** Validate schema and data migrations
- ✅ **Backup & Recovery:** Test database backup and restore

---

## Phase 9: Cloud and Infrastructure Testing

*Modern applications run on cloud platforms. SDETs must understand cloud testing.*

### Cloud Platforms Overview

| Platform | Strengths | Popular Services |
|---|---|---|
| **AWS** | Market leader, most services | EC2, Lambda, S3, RDS |
| **Azure** | Best for Microsoft ecosystem | App Service, Functions, CosmosDB |
| **Google Cloud** | Best for data/ML | Compute Engine, Cloud Functions, BigQuery |

### Cloud Testing Types

#### 1. Cloud-Based Testing
**Using cloud services to test applications**

**Benefits:**
- 🌍 Test from multiple geographic locations
- 📈 Scale test infrastructure on-demand
- 💰 Pay only for what you use
- ⚡ Faster test execution with parallel runs

**Services:**
- **BrowserStack:** Cross-browser testing
- **Sauce Labs:** Web and mobile testing
- **AWS Device Farm:** Mobile device testing
- **LambdaTest:** Browser and mobile testing

**Example - BrowserStack Integration:**
```python
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

# BrowserStack credentials
USERNAME = "your_username"
ACCESS_KEY = "your_access_key"

desired_cap = {
    'os': 'Windows',
    'os_version': '11',
    'browser': 'Chrome',
    'browser_version': 'latest',
    'name': 'BrowserStack Test',
    'build': 'browserstack-build-1'
}

driver = webdriver.Remote(
    command_executor=f'https://{USERNAME}:{ACCESS_KEY}@hub-cloud.browserstack.com/wd/hub',
    desired_capabilities=desired_cap
)

driver.get("https://www.google.com")
print(driver.title)
driver.quit()
```

#### 2. Testing Cloud-Native Applications

**Microservices Testing:**
```python
import requests

def test_microservice_communication():
    """Test communication between microservices"""
    # Service 1: User Service
    user_response = requests.get('http://user-service/api/users/123')
    assert user_response.status_code == 200
    user_data = user_response.json()
    
    # Service 2: Order Service (depends on User Service)
    order_response = requests.get(f'http://order-service/api/users/{user_data["id"]}/orders')
    assert order_response.status_code == 200
    
    # Verify service integration
    orders = order_response.json()
    assert len(orders) > 0

def test_service_health_checks():
    """Test microservices health endpoints"""
    services = [
        'http://user-service/health',
        'http://order-service/health',
        'http://payment-service/health'
    ]
    
    for service_url in services:
        response = requests.get(service_url)
        assert response.status_code == 200
        assert response.json()['status'] == 'healthy'
```

#### 3. Serverless Testing (AWS Lambda)

```python
import boto3
import json

def test_lambda_function():
    """Test AWS Lambda function"""
    lambda_client = boto3.client('lambda', region_name='us-east-1')
    
    payload = {
        'user_id': 123,
        'action': 'get_profile'
    }
    
    response = lambda_client.invoke(
        FunctionName='UserProfileFunction',
        InvocationType='RequestResponse',
        Payload=json.dumps(payload)
    )
    
    result = json.loads(response['Payload'].read())
    assert result['statusCode'] == 200
    assert 'user_id' in result['body']
```

#### 4. Container Testing (Docker/Kubernetes)

**Docker Testing:**
```python
import docker
import pytest

@pytest.fixture
def docker_client():
    return docker.from_env()

def test_container_health(docker_client):
    """Test Docker container is running and healthy"""
    container = docker_client.containers.get('my-app-container')
    assert container.status == 'running'
    
    # Check container logs
    logs = container.logs(tail=10).decode('utf-8')
    assert 'Error' not in logs
    
    # Check container stats
    stats = container.stats(stream=False)
    memory_usage = stats['memory_stats']['usage']
    memory_limit = stats['memory_stats']['limit']
    memory_percent = (memory_usage / memory_limit) * 100
    assert memory_percent < 80, f"Memory usage too high: {memory_percent}%"

def test_container_networking(docker_client):
    """Test containers can communicate"""
    web_container = docker_client.containers.get('web')
    db_container = docker_client.containers.get('database')
    
    # Both should be on same network
    assert web_container.attrs['NetworkSettings']['Networks']
    assert db_container.attrs['NetworkSettings']['Networks']
```

**Kubernetes Testing:**
```python
from kubernetes import client, config

def test_kubernetes_deployment():
    """Test K8s deployment status"""
    config.load_kube_config()
    v1 = client.AppsV1Api()
    
    deployment = v1.read_namespaced_deployment(
        name='my-app',
        namespace='default'
    )
    
    # Check desired vs ready replicas
    assert deployment.status.ready_replicas == deployment.spec.replicas
    assert deployment.status.available_replicas > 0

def test_kubernetes_service():
    """Test K8s service is accessible"""
    config.load_kube_config()
    v1 = client.CoreV1Api()
    
    service = v1.read_namespaced_service(
        name='my-app-service',
        namespace='default'
    )
    
    # Verify service has endpoints
    assert service.spec.cluster_ip is not None
    assert len(service.spec.ports) > 0
```

### Infrastructure as Code (IaC) Testing

**Terraform Testing:**
```python
import subprocess
import json

def test_terraform_plan():
    """Test Terraform configuration"""
    result = subprocess.run(
        ['terraform', 'plan', '-json'],
        capture_output=True,
        text=True
    )
    
    assert result.returncode == 0
    
    # Parse plan output
    for line in result.stdout.split('\n'):
        if line.strip():
            try:
                plan_data = json.loads(line)
                # Add specific validations
            except json.JSONDecodeError:
                pass

def test_terraform_state():
    """Validate Terraform state"""
    result = subprocess.run(
        ['terraform', 'show', '-json'],
        capture_output=True,
        text=True
    )
    
    state = json.loads(result.stdout)
    resources = state['values']['root_module']['resources']
    
    # Verify critical resources exist
    resource_types = [r['type'] for r in resources]
    assert 'aws_instance' in resource_types
    assert 'aws_s3_bucket' in resource_types
```

> **Action Items:**
> - Learn Docker basics and containerize your test framework
> - Practice with AWS Free Tier or Azure Free Account
> - Explore cloud testing platforms (BrowserStack, Sauce Labs)
> - Understand Kubernetes fundamentals for modern DevOps

---

## SDET Interview Preparation

### Interview Structure

Most SDET interviews consist of multiple rounds:

1. **Phone Screen (30-45 min):** Basic technical questions, background discussion
2. **Coding Round (45-60 min):** LeetCode-style problems, algorithmic thinking
3. **Automation Design (45-60 min):** Framework design, testing strategies
4. **System Design (45-60 min):** Design scalable test architecture (Senior roles)
5. **Behavioral Round (30-45 min):** Team fit, past experiences, leadership
6. **Hiring Manager Round (30-45 min):** Role expectations, team dynamics

### Coding Questions

**Focus Areas:**
- **Data Structures:** Arrays, Strings, Hash Maps, Sets, Stacks, Queues, Trees, Graphs
- **Algorithms:** Sorting, Searching, Two Pointers, Sliding Window, BFS, DFS, Recursion
- **Complexity Analysis:** Time and Space complexity (Big O notation)

#### Common SDET Coding Problems

**1. String Manipulation**
```python
# Problem: Find duplicate characters in a string
def find_duplicates(s):
    char_count = {}
    duplicates = []
    
    for char in s:
        char_count[char] = char_count.get(char, 0) + 1
    
    for char, count in char_count.items():
        if count > 1:
            duplicates.append(char)
    
    return duplicates

# Test case
assert find_duplicates("programming") == ['r', 'g', 'm']
```

**2. Array Problems**
```python
# Problem: Two Sum (LeetCode #1)
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Test case
assert two_sum([2, 7, 11, 15], 9) == [0, 1]
```

**3. Testing-Specific Problem**
```python
# Problem: Validate email addresses from a list
import re

def validate_emails(emails):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    valid = []
    invalid = []
    
    for email in emails:
        if re.match(pattern, email):
            valid.append(email)
        else:
            invalid.append(email)
    
    return {'valid': valid, 'invalid': invalid}

# Test case
emails = ['test@example.com', 'invalid.email', 'user@test.co.uk']
result = validate_emails(emails)
assert len(result['valid']) == 2
assert len(result['invalid']) == 1
```

**Practice Resources:**
- 🎯 **LeetCode:** [www.leetcode.com](https://leetcode.com/) - Top 75 Questions
- 🎯 **HackerRank:** [www.hackerrank.com](https://hackerrank.com/) - Interview Preparation Kit
- 🎯 **NeetCode:** [neetcode.io](https://neetcode.io/) - Curated problem list with video solutions

> **Pro Tip:** Focus on Easy and Medium problems. Master 150 problems across different patterns.

### Automation & Design Questions

#### Question 1: "Design a test automation framework from scratch"

**Answer Structure:**
```
1. **Requirements Gathering:**
   - Application type (Web, Mobile, API)
   - Programming language
   - Team size and skills
   - CI/CD requirements

2. **Framework Architecture:**
   ├── Test Layer (Test cases)
   ├── Page Object Layer (UI elements)
   ├── Business Logic Layer (Workflows)
   ├── Utilities (Helpers, database, API)
   ├── Configuration (Environment settings)
   └── Reporting (Test results)

3. **Technology Stack:**
   - Language: Python / Java / JavaScript
   - Test Runner: Pytest / TestNG / Jest
   - Web Automation: Selenium / Playwright / Cypress
   - API Testing: Requests / REST-Assured
   - Reporting: Allure / ExtentReports
   - CI/CD: Jenkins / GitHub Actions

4. **Design Patterns:**
   - Page Object Model (POM)
   - Factory Pattern (Driver creation)
   - Singleton Pattern (Config reader)

5. **Best Practices:**
   - Data-driven testing
   - Parallel execution
   - Retry mechanism for flaky tests
   - Screenshot on failure
   - Comprehensive logging
```

#### Question 2: "How would you test a login page?"

**Answer Structure:**
```
**Functional Testing:**
✅ Valid username and password → Success
✅ Invalid username → Error message
✅ Invalid password → Error message
✅ Empty fields → Validation errors
✅ Special characters in password
✅ Case sensitivity of username
✅ "Remember me" functionality
✅ "Forgot password" link
✅ Session management after login
✅ Logout functionality

**Non-Functional Testing:**
✅ Response time < 2 seconds
✅ Security (SQL injection, XSS)
✅ Password masking
✅ HTTPS encryption
✅ Account lockout after failed attempts
✅ CAPTCHA after N failed attempts

**Edge Cases:**
✅ Very long username/password
✅ Unicode characters
✅ Multiple tabs/browsers
✅ Network interruption during login
✅ Concurrent logins same account

**Test Levels:**
- UI Testing: Selenium/Cypress
- API Testing: POST /api/login endpoint
- Database: Verify user session created
- Security: OWASP ZAP scan
```

#### Question 3: "What's your favorite automation tool and why?"

**Good Answer Example:**
```
"I'm most experienced with Selenium because of its versatility:

**Pros:**
- Multi-language support (Python, Java, C#)
- Cross-browser compatibility
- Large community and support
- Integration with many frameworks
- Can test legacy applications

**Cons:**
- Slower than modern tools
- More boilerplate code
- Setup can be complex
- Waits need careful handling

However, I'm also learning Playwright for new projects because:
- Much faster execution
- Better auto-waiting mechanisms
- Built-in debugging tools
- Modern async/await support

The choice depends on project requirements:
- Selenium: Enterprise apps, multiple languages
- Cypress/Playwright: Modern web apps, JavaScript teams
- Appium: Mobile applications

I believe in choosing the right tool for the job rather than having a single favorite."
```

#### Question 4: "How do you handle flaky tests?"

**Answer:**
```
1. **Identify Root Cause:**
   - Timing issues (use explicit waits)
   - Test data dependencies
   - Environment instability
   - Network latency

2. **Solutions:**
   - Implement robust waits (WebDriverWait)
   - Isolate test data
   - Add retry mechanism
   - Run tests in stable environments
   - Use test containers (Docker)

3. **Monitoring:**
   - Track flaky test metrics
   - Prioritize fixing high-impact flaky tests
   - Quarantine consistently flaky tests

4. **Prevention:**
   - Code reviews for test code
   - Follow best practices
   - Independent, atomic tests
   - Avoid sleep() statements
```

### System Design Questions (Senior SDET)

#### "Design a distributed test execution system"

**Key Points to Cover:**
```
1. **Requirements:**
   - 10,000+ tests need to run
   - Complete in under 30 minutes
   - Support multiple browsers/devices
   - Generate unified reports

2. **Architecture:**
   ┌──────────────┐
   │ Test Trigger │ (Jenkins/GitHub Actions)
   └──────┬───────┘
          │
   ┌──────▼───────┐
   │ Test Manager │ (Orchestrator)
   └──────┬───────┘
          │
   ┌──────▼────────────────────────┐
   │  Distribute Tests to Workers  │
   ├───────────────────────────────┤
   │ Worker 1  │ Worker 2  │ ... N │
   └───────────────────────────────┘
          │
   ┌──────▼───────┐
   │ Report Server│
   └──────────────┘

3. **Components:**
   - **Queue System:** RabbitMQ / Redis
   - **Workers:** Docker containers
   - **Test Allocation:** Dynamic based on load
   - **Results Storage:** Database (MongoDB)
   - **Reporting:** Aggregated dashboard

4. **Scalability:**
   - Auto-scale workers based on demand
   - Use cloud services (AWS/Azure)
   - Implement test sharding
   - Prioritize critical tests

5. **Reliability:**
   - Retry failed tests
   - Health checks on workers
   - Fallback mechanisms
   - Monitoring and alerts
```

### Behavioral Questions (STAR Method)

#### Structure Your Answers:
- **S**ituation: Set the context
- **T**ask: Describe your responsibility
- **A**ction: Explain what you did
- **R**esult: Share the outcome (quantify if possible)

#### Common Questions & Sample Answers:

**1. "Tell me about a time you found a critical bug"**

```
Situation: During regression testing for our e-commerce platform before a major sale event.

Task: I was responsible for testing the checkout flow, including payment processing.

Action:
- Noticed payment gateway returned success but order status showed "pending"
- Investigated API logs and found timeout in payment callback
- Reproduced issue with slow network conditions
- Documented with logs, screenshots, and steps to reproduce
- Prioritized as Critical severity and communicated to team

Result:
- Bug was fixed before production release
- Prevented potential revenue loss ($100K+ estimated)
- Led to implementation of better payment monitoring
- I was recognized in team meeting for thorough testing
```

**2. "How do you handle disagreement with a developer?"**

```
Situation: Developer marked my bug as "Won't Fix" saying it's edge case.

Task: Convince team this needs to be fixed while maintaining good relationship.

Action:
- Gathered data on how many users affected (analytics)
- Prepared clear reproduction steps and impact analysis
- Scheduled 1:1 meeting to discuss (not in public)
- Listened to their concerns about time/complexity
- Proposed compromise: simple validation fix instead of architecture change

Result:
- Developer agreed to implement the simpler fix
- Bug was resolved in next sprint
- Our professional relationship remained strong
- Established better communication process for future
```

**3. "Describe a time you had to learn a new technology quickly"**

```
Situation: Company decided to migrate from Selenium to Cypress mid-project.

Task: Become proficient in Cypress within 2 weeks to migrate 50 tests.

Action:
- Created learning plan: docs, tutorials, practice
- Built POC with 5 representative tests
- Identified patterns and created reusable components
- Documented learnings for team
- Pair programmed with team members

Result:
- Successfully migrated all 50 tests in 3 weeks
- Reduced test execution time by 40%
- Created Cypress best practices guide for team
- Became go-to person for Cypress questions
```

### Technical Questions You Should Ask

**To Hiring Manager:**
- What's the current test coverage?
- How much test automation exists?
- What's the release frequency?
- How is quality measured in the team?

**To Team Members:**
- What's your tech stack?
- What testing tools do you use?
- How do you handle flaky tests?
- What's your biggest testing challenge?

**About Growth:**
- What learning opportunities are available?
- Is there a testing community of practice?
- What conferences/training does company support?

> **Action Items:**
> - Practice **[Coding Interview Problems](index.html?topic=coding-interview-practice)** daily
> - Mock interviews with peers
> - Record yourself answering questions
> - Prepare your own STAR stories
> - Research the company's tech stack

---

---

## Continuous Learning and Career Growth

*The SDET journey never ends. Stay curious, keep learning, and grow your career.*

### Learning Resources

#### Books 📚
- **"Clean Code" by Robert C. Martin** - Writing maintainable code
- **"Test Driven Development" by Kent Beck** - TDD principles
- **"Agile Testing" by Lisa Crispin & Janet Gregory** - Modern testing approaches
- **"The Phoenix Project" by Gene Kim** - DevOps and CI/CD culture
- **"Continuous Delivery" by Jez Humble** - Modern deployment practices
- **"Design Patterns" by Gang of Four** - Software design patterns

#### Online Platforms 🎓
- **Udemy:** Selenium, Cypress, API testing courses
- **Test Automation University:** Free courses by industry experts
- **Coursera:** Software testing specializations
- **Pluralsight:** Comprehensive tech learning
- **LinkedIn Learning:** Various testing courses

#### Blogs & Websites 📰
- **Ministry of Testing:** [www.ministryoftesting.com](https://www.ministryoftesting.com/)
- **Software Testing Help:** Tutorials and guides
- **Guru99:** Testing tutorials and examples
- **Martin Fowler's Blog:** Software architecture and testing
- **Test Guild Podcast:** Industry insights

#### YouTube Channels 📺
- **SDET- QA Automation Techie**
- **Automation Step by Step - Raghav Pal**
- **Test Automation University**
- **Naveen AutomationLabs**
- **Execute Automation**

### Career Path & Progression

```
Entry Level SDET (0-2 years)
├── Learn automation fundamentals
├── Master one programming language
├── Build basic frameworks
└── Support existing test suites
    │
    ▼
SDET II / Mid-Level (2-4 years)
├── Design test frameworks
├── API and UI automation
├── CI/CD integration
├── Mentor junior SDETs
└── Code reviews
    │
    ▼
Senior SDET (4-7 years)
├── Architecture decisions
├── Cross-team collaboration
├── Performance & Security testing
├── Establish best practices
└── Technical leadership
    │
    ▼
Staff/Principal SDET (7-10 years)
├── Company-wide quality strategy
├── Tool evaluation & adoption
├── Thought leadership
├── Mentor multiple teams
└── Influence engineering culture
    │
    ▼
┌────────────────────┬────────────────────┐
│                    │                    │
▼                    ▼                    ▼
SDET Manager      Architect          Principal Engineer
├── People mgmt   ├── System design   ├── Technical expert
├── Hiring        ├── Standards       ├── Innovation leader
├── Strategy      ├── Scalability     ├── Industry speaker
└── Budget        └── Best practices  └── Technical advisor
```

### Skills Matrix by Level

| Skill Category | Junior SDET | Mid SDET | Senior SDET | Staff SDET |
|---|---|---|---|---|
| **Programming** | 1 language | 2 languages | 3+ languages | Expert level |
| **Automation** | Basic scripts | Framework building | Advanced patterns | Architecture |
| **API Testing** | Manual testing | Automated tests | Performance testing | Strategy |
| **CI/CD** | Run pipelines | Configure pipelines | Design pipelines | Optimize platform |
| **Mentoring** | Learn from others | Help juniors | Lead team | Cross-org influence |
| **System Design** | Basic | Moderate | Advanced | Expert |

### Stay Current with Technology

#### Weekly Routine
- 📖 Read 2-3 technical articles
- 💻 Code for 1 hour (personal projects)
- 🎥 Watch 1 technical video
- 📝 Write/document learnings

#### Monthly Goals
- 📚 Complete 1 online course module
- 🛠️ Try 1 new tool/technology
- 📊 Attend 1 meetup/webinar
- 🤝 Network with other SDETs

#### Yearly Targets
- 🎯 Master 1 major technology (e.g., Kubernetes, AWS)
- 🏆 Contribute to open-source project
- 📢 Give a presentation/talk
- 📄 Get a certification (if valuable)

### Valuable Certifications

**Programming:**
- ☑️ Oracle Certified Java Programmer
- ☑️ Python Institute PCAP/PCPP

**Cloud:**
- ☑️ AWS Certified Developer/Solutions Architect
- ☑️ Azure Developer Associate
- ☑️ Google Cloud Professional

**Testing:**
- ☑️ ISTQB Foundation Level (entry point)
- ☑️ ISTQB Test Automation Engineer
- ☑️ Certified Selenium Professional

**DevOps:**
- ☑️ Docker Certified Associate
- ☑️ Certified Kubernetes Administrator (CKA)
- ☑️ Jenkins Engineer

> **Note:** Certifications are helpful but not mandatory. Practical skills and portfolio matter more.

### Building Your Portfolio

**GitHub Projects:**
1. **Test Automation Framework** - Showcase your framework skills
2. **API Testing Suite** - Demonstrate API testing
3. **CI/CD Pipeline** - Show DevOps knowledge
4. **Coding Solutions** - LeetCode problem solutions
5. **Testing Tools** - Utilities you've built

**Personal Website/Blog:**
- Document your learnings
- Share testing strategies
- Tutorial articles
- Case studies from projects

**Contribute to Open Source:**
- Test existing projects
- Report bugs with good documentation
- Submit pull requests
- Help with documentation

### Networking & Community

**Join Communities:**
- 🌐 **Ministry of Testing:** Global testing community
- 💬 **Reddit:** r/softwaretesting, r/QualityAssurance
- 💼 **LinkedIn Groups:** SDET groups, testing forums
- 🐦 **Twitter:** Follow testing thought leaders
- 📱 **Discord/Slack:** Testing communities

**Attend Events:**
- 🎤 Local meetups (QA, DevOps, Programming)
- 🎪 Conferences (SeleniumConf, TestBash)
- 🎓 Webinars and workshops
- 🤝 Networking events

**Share Knowledge:**
- ✍️ Write blog posts
- 🎤 Give talks at meetups
- 🎥 Create tutorial videos
- 💬 Answer questions on forums

### Salary Progression (US Market - 2025)

| Level | Years | Salary Range | Total Comp |
|---|---|---|---|
| **Junior SDET** | 0-2 | $65K - $90K | $70K - $100K |
| **SDET** | 2-4 | $85K - $120K | $95K - $140K |
| **Senior SDET** | 4-7 | $110K - $160K | $130K - $200K |
| **Staff SDET** | 7-10 | $140K - $200K | $170K - $280K |
| **Principal SDET** | 10+ | $170K - $250K | $220K - $400K |

*Note: Varies significantly by location (SF/NYC higher), company size, and industry.*

---

## Conclusion

The SDET journey is one of continuous learning and growth. The technologies will change, frameworks will evolve, but the core principles remain constant: **quality, automation, and a developer's mindset**.

### Key Takeaways

1. **🎯 Build a Strong Foundation**
   - Master QA fundamentals before diving into automation
   - Understand what to test and why before automating

2. **💻 Code Every Day**
   - Your programming skills are your greatest asset
   - Practice consistently, even if just 30 minutes daily

3. **🏗️ Think Architecture, Not Just Scripts**
   - Design scalable, maintainable frameworks
   - Apply software engineering best practices to test code

4. **🔄 Embrace CI/CD Culture**
   - Understand how testing fits into the deployment pipeline
   - Quality is everyone's responsibility, not just testers'

5. **📈 Go Beyond Functional Testing**
   - Performance, security, and accessibility matter
   - Non-functional requirements are just as critical

6. **🤝 Collaborate and Communicate**
   - Work closely with developers, not in isolation
   - Advocate for quality across the organization

7. **🔍 Be Curious and Experimental**
   - Explore new tools and technologies
   - Don't be afraid to try and fail

8. **📚 Never Stop Learning**
   - The tech landscape changes rapidly
   - Dedicate time for continuous learning

### Your Next Steps

**Week 1-2:**
- ✅ Choose a programming language and complete basic tutorials
- ✅ Set up your development environment
- ✅ Explore **[Getting Started Guide](index.html?topic=getting-started)**

**Month 1:**
- ✅ Complete 20 coding problems on LeetCode
- ✅ Build a simple automation script (web scraper or API client)
- ✅ Review **[Manual Testing Concepts](index.html?topic=manual-concepts)**

**Month 2-3:**
- ✅ Learn Selenium/Cypress and build 10 UI tests
- ✅ Study **[Test Automation Frameworks](index.html?topic=test-automation-frameworks)**
- ✅ Set up a GitHub repository for your framework

**Month 4-6:**
- ✅ Master API testing with REST-Assured or Requests
- ✅ Integrate tests into CI/CD pipeline
- ✅ Explore **[CI/CD Pipelines](index.html?topic=ci-cd-pipelines)**

**Beyond:**
- ✅ Contribute to open-source projects
- ✅ Build a complete portfolio on GitHub
- ✅ Network with other SDETs
- ✅ Start applying for SDET roles

---

### Remember

> "Quality is not an act, it is a habit." - Aristotle

The difference between a good SDET and a great SDET is not just technical skills, but:
- **Attention to detail**
- **Critical thinking**
- **Problem-solving mindset**
- **Passion for quality**
- **Continuous improvement**

**You don't need to know everything to start.** You just need to start and keep learning. Every expert SDET was once a beginner who never gave up.

**The journey is challenging, but incredibly rewarding.** You'll build things that protect millions of users, prevent critical bugs, and enable faster, safer releases. You'll be at the intersection of development and quality, making you one of the most valuable members of any engineering team.

---

### Connect & Contribute

Have questions or suggestions for this guide?
- 🐛 Found an error? Let us know!
- 💡 Have a tip to share? Contribute!
- 🤝 Want to connect? Join our community!

---

**Good luck on your SDET journey!** 🚀

**Now go build something amazing and test it thoroughly!** ✨

---

**Happy Testing & Automating!** 🎉