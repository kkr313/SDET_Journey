# Manual Testing Concepts

## 1. What is Software Testing?
**Definition:** Software Testing is the process of evaluating a software application to ensure it meets the specified requirements and is free of defects.

**Purpose:**
- Ensure product quality
- Prevent defects
- Validate functionality
- Improve user satisfaction

**Example:** Testing a food delivery app for search, cart, payment, and tracking features.

---

## 2. What is Manual Testing?
**Definition:** Manual Testing is a type of software testing where test cases are executed manually without automation tools.

**Characteristics:**
- No scripts or tools
- Human interaction
- Ideal for UI and exploratory testing

**Example:** Manually testing login functionality by entering credentials and verifying dashboard access.

---

## 3. SDLC vs STLC
| Aspect | SDLC | STLC |
|--------|------|------|
| Focus | Entire development | Testing process |
| Phases | Requirement → Design → Development → Testing → Deployment → Maintenance | Requirement Analysis → Test Planning → Test Case Design → Test Environment Setup → Test Execution → Test Closure |
| Output | Working software | Verified and validated software |

---

## 4. Types of Manual Testing
- **Functional Testing:** Validates business logic (e.g., login, search)
- **Non-Functional Testing:** Validates performance and usability
- **Smoke Testing:** Basic build stability checks
- **Sanity Testing:** Quick checks after minor changes
- **Regression Testing:** Ensures new changes don’t break existing features
- **Exploratory Testing:** Unscripted testing based on intuition
- **Ad-hoc Testing:** Random testing without documentation
- **Usability Testing:** Checks user-friendliness
- **Compatibility Testing:** Tests across devices/browsers
- **Accessibility Testing:** Ensures usability for disabled users

---

## 4.1 Retesting vs Regression
| Aspect | Retesting | Regression |
|--------|-----------|-----------|
| Definition | Testing failed test cases after fixes | Testing to ensure new changes don’t break existing features |
| Focus | Specific defects | Overall application |
| Example | Re-executing a failed login test after bug fix | Running all login, search, and payment tests after a new feature |

---

## 4.2 Smoke vs Sanity
| Aspect | Smoke Testing | Sanity Testing |
|--------|--------------|---------------|
| Definition | Basic tests to check build stability | Quick tests to verify minor changes |
| Purpose | Accept/reject a build for further testing | Validate specific functionality after changes |
| Example | App launch, login, dashboard load | Only login after password update |

---

## 4.3 Types of Functional Testing
- **Unit Testing:** Tests individual components or functions
- **Integration Testing:** Tests interactions between modules
- **System Testing:** Tests the complete system as a whole
- **User Acceptance Testing (UAT):** Validates software against user requirements
- **Interface Testing:** Checks communication between systems
- **Regression Testing:** Ensures new changes don’t break existing features
- **Smoke Testing:** Basic build stability checks
- **Sanity Testing:** Quick checks after minor changes

## 4.4 Types of Non-Functional Testing
- **Performance Testing:** Measures speed, responsiveness, and stability
- **Load Testing:** Checks system behavior under expected load
- **Stress Testing:** Evaluates system under extreme conditions
- **Usability Testing:** Assesses user-friendliness
- **Security Testing:** Identifies vulnerabilities and risks
- **Compatibility Testing:** Ensures proper function across devices/browsers
- **Accessibility Testing:** Verifies usability for disabled users
- **Reliability Testing:** Checks system consistency over time
- **Scalability Testing:** Assesses ability to handle growth

---

## 5. Test Case Design Techniques
- **Equivalence Partitioning:** Divide input into valid/invalid groups
- **Boundary Value Analysis:** Test edges of input ranges
- **Decision Table:** Tabular representation of rules
- **State Transition:** Tests based on state changes
- **Error Guessing:** Based on tester’s experience

---

## 6. Test Case vs Test Scenario
| Aspect | Test Case | Test Scenario |
|--------|-----------|---------------|
| Definition | Detailed steps | High-level functionality |
| Example | Steps to test login | "Verify login functionality" |
| Documentation | Detailed | Minimal |
| Reusability | High | Low |

---

## 7. Bug Life Cycle
1. New
2. Assigned
3. Open
4. Fixed
5. Retest
6. Verified
7. Closed
8. Reopened

---

## 8. Severity vs Priority
| Term | Meaning | Example |
|------|---------|---------|
| Severity | Impact of the bug | App crash = High severity |
| Priority | Urgency to fix | Logo typo = Low severity, High priority |

---

## 9. Verification vs Validation
| Term | Meaning | Example |
|------|---------|---------|
| Verification | Are we building the product right? | Reviewing design documents |
| Validation | Are we building the right product? | Testing login functionality |

---

## 10. Test Plan vs Test Strategy
| Aspect | Test Plan | Test Strategy |
|--------|-----------|---------------|
| Scope | Project-specific | Organization-wide |
| Owner | QA Lead | QA Manager |
| Content | Objectives, schedule, resources | Approach, tools, standards |
| Example | Login module test plan | Overall testing approach |

---

## 11. Test Deliverables
- Test Plan
- Test Cases
- Test Scripts
- Bug Reports
- Test Summary Report

---

## 12. Manual Testing Workflow
1. Requirement Analysis
2. Test Planning
3. Test Case Design
4. Test Environment Setup
5. Test Execution
6. Defect Reporting
7. Test Closure

---

## 13. White Box vs Gray Box vs Black Box Testing
| Aspect | White Box Testing | Gray Box Testing | Black Box Testing |
|--------|------------------|-----------------|------------------|
| Definition | Testing with full knowledge of internal code and logic | Testing with partial knowledge of internal code and logic | Testing without any knowledge of internal code; focuses on functionality |
| Tester | Developers or testers with coding skills | Testers with some access to code or architecture | End users or testers with no access to code |
| Focus | Code structure, logic, paths, branches | Integration, data flow, and functionality | Inputs and outputs, user requirements |
| Example | Unit testing, code coverage analysis | Testing APIs with some design docs | Functional testing, UI testing |

---

## 14. Interview Q&A - Common, Basic, Advanced & Tricky

### Basic Interview Q&A
**Q1:** What is exploratory testing?  
**A:** Testing without predefined test cases.

**Q2:** What is a test environment?  
**A:** Setup of hardware, software, and network for testing.

**Q3:** What is a defect?  
**A:** A deviation from expected behavior.

**Q4:** Difference between QA and QC?  
- QA: Process-oriented, prevents defects  
- QC: Product-oriented, identifies defects

**Q5:** What is test data?  
**A:** Data used to execute test cases. It is important for validating different scenarios and edge cases.

**Q6:** What is a test suite?  
**A:** A collection of test cases intended to be executed together.

**Q7:** What is a test script?  
**A:** A set of instructions to automate or manually execute a test case.

**Q8:** What is a test harness?  
**A:** A framework that provides support for test execution, including stubs and drivers.

**Q9:** What are stubs and drivers?  
**A:** Stubs simulate lower-level modules, drivers simulate higher-level modules during integration testing.

**Q10:** What is end-to-end testing?  
**A:** Testing the complete workflow of an application from start to finish.

**Q11:** What is risk-based testing?  
**A:** Prioritizing tests based on the risk of failure and business impact.

**Q12:** What is monkey testing?  
**A:** Random testing without any predefined test cases or scenarios.

**Q13:** What is a test oracle?  
**A:** A mechanism to determine whether a test has passed or failed.

**Q14:** What is acceptance criteria?  
**A:** Conditions that a software product must satisfy to be accepted by a user or customer.

**Q15:** What is the pesticide paradox in testing?  
**A:** Repeating the same tests will not find new bugs; tests need to be updated regularly.

**Q16:** What is the difference between alpha and beta testing?  
**A:** Alpha is done by internal teams, beta is done by external users before release.

**Q17:** What is the difference between test case and use case?  
**A:** Test case validates functionality, use case describes user interactions with the system.

**Q18:** What is the difference between manual and automated testing?  
**A:** Manual is performed by humans, automated uses tools/scripts.

**Q19:** What is the difference between functional and non-functional requirements?  
**A:** Functional defines what the system should do, non-functional defines how the system should be (performance, usability, etc.).

**Q20:** What is the difference between verification, validation, and testing?  
**A:** Verification checks if product is built right, validation checks if right product is built, testing is the process of finding defects.

### Advanced Questions
**Q21:** What is root cause analysis?  
**A:** The process of identifying the underlying reason for a defect.

**Q22:** How do you prioritize test cases?  
**A:** Based on risk, business impact, and critical functionality.

**Q23:** What is test coverage?  
**A:** A metric that shows the percentage of requirements or code exercised by tests.

**Q24:** What is a traceability matrix?  
**A:** A document mapping requirements to test cases to ensure coverage.

**Q25:** What is defect leakage?  
**A:** Defects missed during testing and found in production.

### Tricky Questions
**Q26:** Can you test a system without requirements?  
**A:** Yes, using exploratory, ad-hoc, and experience-based testing.

**Q27:** What if a developer disagrees with your bug?  
**A:** Provide clear evidence, steps to reproduce, and collaborate for resolution.

**Q28:** How do you test an application with minimal documentation?  
**A:** Use exploratory testing, ask stakeholders, and rely on domain knowledge.

**Q29:** What is the difference between error, defect, and failure?  
**A:**  
- Error: Human mistake in code or design  
- Defect: Flaw in software due to error  
- Failure: Software does not perform as expected in execution

**Q30:** How do you handle frequently changing requirements?  
**A:** Use flexible test scenarios, maintain good communication, and update test cases regularly.

**Q31:** What is negative testing?  
**A:** Testing with invalid data or conditions to ensure the system handles errors gracefully.

**Q32:** What is the difference between static and dynamic testing?  
**A:**  
- Static: Testing without executing code (reviews, walkthroughs)  
- Dynamic: Testing by executing code (actual test execution)


