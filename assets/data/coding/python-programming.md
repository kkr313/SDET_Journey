# Python Programming for SDET

## Introduction

Python is one of the most popular languages for test automation and SDET roles. Learn Python from basics to advanced concepts.

## Why Python for SDET?

- **Easy to Learn**: Simple, readable syntax
- **Rich Libraries**: Extensive testing frameworks (pytest, unittest, selenium)
- **Versatile**: Web testing, API testing, performance testing
- **Community Support**: Large community and resources

## Python Basics

### 1. Variables and Data Types
```python
# Variables
name = "SDET"
age = 25
salary = 75000.50
is_employed = True

# Data Types
integer_var = 10
float_var = 10.5
string_var = "Hello"
list_var = [1, 2, 3]
tuple_var = (1, 2, 3)
dict_var = {"key": "value"}
set_var = {1, 2, 3}
```

### 2. Control Flow
```python
# If-else
if age > 18:
    print("Adult")
else:
    print("Minor")

# For loop
for i in range(5):
    print(i)

# While loop
count = 0
while count < 5:
    print(count)
    count += 1
```

### 3. Functions
```python
def greet(name):
    return f"Hello, {name}!"

# Lambda functions
square = lambda x: x * x
```

## Object-Oriented Programming

```python
class TestCase:
    def __init__(self, name):
        self.name = name
    
    def execute(self):
        print(f"Executing {self.name}")

test = TestCase("Login Test")
test.execute()
```

## Testing with Python

### pytest Example
```python
import pytest

def test_addition():
    assert 2 + 2 == 4

def test_string():
    assert "hello".upper() == "HELLO"
```

## Coming Soon

- Advanced Python concepts
- Decorators and Context Managers
- File handling and APIs
- Web scraping for testing
- Database operations
- Async programming

---

**Note:** Detailed Python programming guide with SDET-specific examples is being developed.
