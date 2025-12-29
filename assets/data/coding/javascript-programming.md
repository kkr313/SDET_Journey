# JavaScript Programming for SDET

## Introduction

JavaScript is essential for modern test automation, especially for web applications and end-to-end testing frameworks.

## Why JavaScript for SDET?

- **Frontend Testing**: Native language for web browsers
- **Popular Frameworks**: Playwright, Cypress, WebdriverIO, Puppeteer
- **Full-Stack**: Node.js enables backend testing too
- **Async Operations**: Perfect for handling modern web apps

## JavaScript Basics

### 1. Variables and Data Types
```javascript
// Variables (let, const, var)
let name = "SDET";
const age = 25;
var isEmployed = true;

// Data Types
let number = 42;
let string = "Hello";
let array = [1, 2, 3];
let object = { key: "value" };
let nullValue = null;
let undefinedValue;
```

### 2. Functions
```javascript
// Function declaration
function greet(name) {
    return `Hello, ${name}!`;
}

// Arrow function
const square = (x) => x * x;

// Async function
async function fetchData() {
    const response = await fetch(url);
    return response.json();
}
```

### 3. Control Flow
```javascript
// If-else
if (age > 18) {
    console.log("Adult");
} else {
    console.log("Minor");
}

// For loop
for (let i = 0; i < 5; i++) {
    console.log(i);
}

// Array methods
const numbers = [1, 2, 3, 4, 5];
numbers.forEach(num => console.log(num));
const doubled = numbers.map(num => num * 2);
```

## Object-Oriented JavaScript

```javascript
class TestCase {
    constructor(name) {
        this.name = name;
    }
    
    execute() {
        console.log(`Executing ${this.name}`);
    }
}

const test = new TestCase("Login Test");
test.execute();
```

## Testing with JavaScript

### Playwright Example
```javascript
const { test, expect } = require('@playwright/test');

test('basic test', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
});
```

### Jest Example
```javascript
describe('Math operations', () => {
    test('adds 1 + 2 to equal 3', () => {
        expect(1 + 2).toBe(3);
    });
});
```

## Promises and Async/Await

```javascript
// Promise
const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("Done!"), 1000);
});

// Async/Await
async function getData() {
    try {
        const data = await fetchFromAPI();
        return data;
    } catch (error) {
        console.error(error);
    }
}
```

## Coming Soon

- Advanced JavaScript concepts
- ES6+ features
- DOM manipulation for testing
- API testing with JavaScript
- WebSocket testing
- Performance testing

---

**Note:** Comprehensive JavaScript guide with automation examples is under development.
