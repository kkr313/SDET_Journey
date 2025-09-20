# API Testing Fundamentals

API (Application Programming Interface) testing is a critical skill for modern SDETs. This guide covers the fundamentals of API testing, tools, and best practices.

## What is API Testing?

API testing involves testing application programming interfaces directly and as part of integration testing to determine if they meet expectations for functionality, reliability, performance, and security.

Unlike UI testing, API testing:
- Focuses on the business logic layer
- Is language-independent
- Typically provides faster test execution
- Offers earlier testing in the development cycle

## Types of APIs

### REST APIs
- Uses HTTP methods (GET, POST, PUT, DELETE)
- Stateless communication
- Data typically in JSON or XML format
- Resource-oriented architecture

### SOAP APIs
- Protocol-specific with stricter standards
- Uses XML exclusively
- Typically more verbose than REST
- Includes built-in error handling

### GraphQL APIs
- Query language for APIs
- Clients can request exactly what they need
- Single endpoint for all operations
- Strongly typed schema

## API Testing Types

### Functional Testing
Verifies that API functions work as expected:
- Endpoint availability
- Request and response validation
- Error handling
- Resource access and authorization

### Performance Testing
Evaluates API performance under various conditions:
- Load testing (normal load)
- Stress testing (beyond normal load)
- Spike testing (sudden increase in load)
- Endurance testing (sustained load)

### Security Testing
Identifies vulnerabilities in the API:
- Authentication mechanisms
- Authorization controls
- Input validation
- Data encryption
- Rate limiting

### Documentation Testing
Ensures API documentation is accurate:
- Endpoint descriptions
- Parameter requirements
- Response formats
- Error codes and messages

## API Testing Process

### 1. Understand API Requirements
- Review API documentation
- Identify endpoints and methods
- Understand authentication mechanisms
- Define expected responses

### 2. Set Up Test Environment
- Configure test servers
- Set up necessary databases
- Prepare test data
- Configure authentication

### 3. Create Test Cases
- Positive scenarios (valid inputs)
- Negative scenarios (invalid inputs)
- Edge cases
- Authentication and authorization tests

### 4. Execute Tests
- Run tests against endpoints
- Validate responses
- Check status codes
- Verify response bodies and headers

### 5. Report and Analyze Results
- Document test results
- Analyze failures
- Report bugs
- Track API changes

## API Testing Tools

### Postman
A popular GUI tool for API testing:

```javascript
// Postman test script example
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response contains user data", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData).to.have.property('name');
    pm.expect(jsonData.email).to.eql("test@example.com");
});
```

### REST Assured
Java library for testing RESTful APIs:

```java
@Test
public void testGetUserEndpoint() {
    given()
        .header("Content-Type", "application/json")
        .auth().oauth2(token)
    .when()
        .get("/api/users/1")
    .then()
        .statusCode(200)
        .body("name", equalTo("John Doe"))
        .body("email", equalTo("john@example.com"));
}
```

### Karate
Open-source tool combining API test automation, mocks, and performance testing:

```gherkin
Feature: User API tests

  Background:
    * url 'https://api.example.com'
    * header Accept = 'application/json'

  Scenario: Get user details
    Given path 'users/1'
    When method GET
    Then status 200
    And match response == { id: 1, name: 'John Doe', email: 'john@example.com' }
```

### SoapUI
Specialized tool for testing SOAP and REST APIs:

```xml
<!-- SoapUI assertion example -->
<con:assertion type="Simple Contains" name="Contains user ID">
  <con:configuration>
    <token>id</token>
    <ignoreCase>false</ignoreCase>
    <useRegEx>false</useRegEx>
  </con:configuration>
</con:assertion>
```

### Python Requests with pytest
Popular Python libraries for API testing:

```python
import requests
import pytest

def test_get_user():
    response = requests.get('https://api.example.com/users/1')
    assert response.status_code == 200
    data = response.json()
    assert data['name'] == 'John Doe'
    assert data['email'] == 'john@example.com'
```

## Best Practices for API Testing

### 1. Isolate the Test Environment
- Use dedicated test environments
- Mock external dependencies when necessary
- Reset test data between test runs

### 2. Test for Expected and Unexpected Inputs
- Test with valid inputs
- Test with invalid inputs
- Test with edge cases (empty values, extremely large values)

```python
# Testing with different input types
@pytest.mark.parametrize("user_id, expected_status", [
    (1, 200),           # Valid ID
    (999999, 404),      # Non-existent ID
    ("abc", 400),       # Invalid ID type
    (None, 400)         # Missing ID
])
def test_get_user_with_different_ids(user_id, expected_status):
    response = requests.get(f'https://api.example.com/users/{user_id}')
    assert response.status_code == expected_status
```

### 3. Validate Response Structure
- Check status codes
- Validate response headers
- Verify response body structure
- Check data types and formats

```javascript
// Postman schema validation
pm.test("Response matches schema", function() {
    const schema = {
        "type": "object",
        "required": ["id", "name", "email"],
        "properties": {
            "id": { "type": "integer" },
            "name": { "type": "string" },
            "email": { "type": "string", "format": "email" }
        }
    };
    
    pm.expect(pm.response.json()).to.be.jsonSchema(schema);
});
```

### 4. Implement Proper Authentication
- Test with valid credentials
- Test with invalid credentials
- Test with expired tokens
- Test permission levels

```java
// Testing different authentication scenarios
@Test
public void testWithValidToken() {
    given()
        .auth().oauth2(validToken)
    .when()
        .get("/api/protected-resource")
    .then()
        .statusCode(200);
}

@Test
public void testWithExpiredToken() {
    given()
        .auth().oauth2(expiredToken)
    .when()
        .get("/api/protected-resource")
    .then()
        .statusCode(401);
}

@Test
public void testWithInsufficientPermissions() {
    given()
        .auth().oauth2(limitedToken)
    .when()
        .get("/api/admin-resource")
    .then()
        .statusCode(403);
}
```

### 5. Automate API Tests
- Integrate with CI/CD pipelines
- Run tests on every build
- Include API tests in regression suites

### 6. Monitor API Performance
- Track response times
- Set performance thresholds
- Monitor error rates

```java
// Response time assertion in REST Assured
@Test
public void testResponseTime() {
    given()
        .header("Content-Type", "application/json")
    .when()
        .get("/api/users")
    .then()
        .time(lessThan(500L)); // Response should be less than 500ms
}
```

### 7. Implement Contract Testing
- Verify API adheres to its contract
- Use tools like Pact or Spring Cloud Contract

```java
// Pact consumer test example
@Pact(consumer = "userServiceClient")
public RequestResponsePact createPact(PactDslWithProvider builder) {
    return builder
        .given("User with ID 1 exists")
        .uponReceiving("A request for user 1")
            .path("/api/users/1")
            .method("GET")
        .willRespondWith()
            .status(200)
            .body(new PactDslJsonBody()
                .integerType("id", 1)
                .stringType("name", "John Doe")
                .stringType("email", "john@example.com"))
        .toPact();
}
```

## Common API Testing Challenges

### 1. Parameter Combinations
- Large number of possible parameter combinations
- Solution: Use equivalence partitioning and boundary value analysis

### 2. Sequencing and Dependencies
- Tests that depend on specific state or sequence
- Solution: Implement proper test setup and teardown

### 3. Validating Complex Responses
- Deeply nested JSON or XML structures
- Solution: Use schema validation and JSON path assertions

```python
# Testing complex JSON response with JSONPath
def test_complex_json_response():
    response = requests.get('https://api.example.com/complex-data')
    assert response.status_code == 200
    data = response.json()
    
    # Using JSONPath to navigate complex structure
    assert jsonpath.jsonpath(data, '$.items[0].details.name')[0] == 'Expected Name'
    assert len(jsonpath.jsonpath(data, '$.items[*]')) == 5  # Should have 5 items
```

### 4. Handling Stateful APIs
- APIs that maintain state between requests
- Solution: Implement proper test isolation and state management

## Conclusion

API testing is a critical skill for SDETs that enables faster, more reliable testing of application functionality. By understanding API testing fundamentals and following best practices, you can create effective test suites that catch issues early in the development process.

As you advance in API testing, explore more advanced topics like:
- API security testing
- Performance testing at scale
- Service virtualization
- Microservices testing strategies
- Event-driven architecture testing