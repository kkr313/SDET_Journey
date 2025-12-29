# Software Development Methodologies & Agile Concepts

## 1. Software Development Methodologies

### 🔹 Waterfall Model
**Definition:** A linear and sequential approach where each phase must be completed before the next begins.  
**Phases:** Requirements → Design → Implementation → Testing → Deployment → Maintenance  
**Pros:** Simple, easy to manage  
**Cons:** Inflexible to changes  
**Example:** Government projects with fixed scope  

### 🔹 V-Model (Verification & Validation)
**Definition:** Extension of Waterfall with corresponding testing phase for each development stage.  
**Phases:** Requirements → Design → Implementation → Testing → Deployment → Maintenance  
**Pros:** Early test planning, defect prevention  
**Cons:** Rigid structure  
**Example:** Medical software development  

### 🔹 Incremental Model
**Definition:** Software is developed and delivered in increments.  
**Phases:** Requirements → Design → Implementation → Testing → Deployment → Maintenance  
**Pros:** Early partial implementation  
**Cons:** Requires good planning  
**Example:** E-learning platforms  

### 🔹 Iterative Model
**Definition:** Repeated cycles of development and refinement.  
**Phases:** Requirements → Design → Implementation → Testing → Deployment → Maintenance  
**Pros:** Continuous improvement  
**Cons:** May lead to scope creep  
**Example:** Game development  

### 🔹 Spiral Model
**Definition:** Combines iterative development with risk analysis.  
**Phases:** Requirements → Design → Implementation → Testing → Deployment → Maintenance  
**Pros:** Risk management  
**Cons:** Complex and costly  
**Example:** Large enterprise systems  

### 🔹 Big Bang Model
**Definition:** Minimal planning, development starts with resources available.  
**Phases:** Requirements → Design → Implementation → Testing → Deployment → Maintenance  
**Pros:** Simple for small projects  
**Cons:** High risk of failure  
**Example:** Student projects  

---

## 2. Agile Methodology

### 🔹 Definition
Agile is an iterative and incremental approach to software development that emphasizes flexibility, collaboration, and customer feedback.

### 🔹 Agile Principles
- Customer satisfaction through early and continuous delivery
- Welcome changing requirements
- Deliver working software frequently
- Close collaboration between business and developers
- Build projects around motivated individuals
- Face-to-face communication
- Working software is the primary measure of progress
- Sustainable development
- Continuous attention to technical excellence
- Simplicity
- Self-organizing teams
- Regular reflection and adjustment

### 🔹 Agile Frameworks
- **Scrum:** Roles (Product Owner, Scrum Master, Team), Events (Sprint, Daily Standup, Review, Retrospective)
- **Kanban:** Visual workflow management
- **XP (Extreme Programming):** Focus on engineering practices
- **SAFe (Scaled Agile Framework):** Agile at enterprise scale

### 🔹 Scrum Artifacts
- **Product Backlog:** Ordered list of everything that might be needed in the product
- **Sprint Backlog:** Set of Product Backlog items selected for the Sprint, plus a plan for delivering them
- **Increment:** The sum of all Product Backlog items completed during a Sprint and previous Sprints

### 🔹 Agile Ceremonies
- **Sprint Planning:** Define what can be delivered in the sprint and how
- **Daily Standup:** Short daily meeting to discuss progress and obstacles
- **Sprint Review:** Review the increment and adapt the backlog if needed
- **Sprint Retrospective:** Reflect on the sprint and identify improvements

### 🔹 Agile Manifesto Values
- **Individuals and interactions** over processes and tools
- **Working software** over comprehensive documentation
- **Customer collaboration** over contract negotiation
- **Responding to change** over following a plan

### 🔹 Scrum Roles
- **Product Owner:** Owns the product backlog, prioritizes work, represents stakeholders
- **Scrum Master:** Facilitates Scrum, removes impediments, coaches the team
- **Development Team:** Cross-functional members who deliver the product increment

### 🔹 User Stories & Acceptance Criteria
- **User Story Format:** As a [user], I want [feature] so that [benefit]
- **INVEST Model:** Independent, Negotiable, Valuable, Estimable, Small, Testable
- **Acceptance Criteria:** Conditions that must be met for a story to be complete

### 🔹 Definition of Done vs. Definition of Ready
- **Definition of Ready:** Criteria for a story to be picked up (clear, sized, testable)
- **Definition of Done:** Criteria for a story to be considered complete (coded, tested, reviewed)

### 🔹 Agile Metrics & Estimation Techniques
- **Metrics:** Burndown chart, velocity, lead time, cycle time
- **Estimation:** Story points, Planning Poker, T-shirt sizing

### 🔹 Agile Testing & QA Role
- QA works closely with developers
- Test automation is encouraged
- Continuous integration and delivery
- Exploratory and acceptance testing

### 🔹 Common Agile Tools
- JIRA
- Trello
- Rally
- VersionOne
- Azure DevOps

### 🔹 Agile Challenges & Anti-patterns
- Resistance to change
- Scrumbut (partial Scrum adoption)
- Micromanagement
- Lack of retrospectives
- Distributed teams

---

## 3. Interview Questions

### ✅ Basic Questions
**Q1:** What is the Waterfall model?  
**A:** The Waterfall model is a linear and sequential software development approach where each phase (requirements, design, implementation, testing, deployment, maintenance) must be completed before the next begins. It is simple and easy to manage but inflexible to changes.

**Q2:** Define Agile methodology.  
**A:** Agile is an iterative and incremental approach to software development that emphasizes flexibility, collaboration, customer feedback, and rapid delivery of working software.

**Q3:** What are the key differences between Waterfall and Agile?  
**A:** Waterfall is linear and rigid, with each phase completed before the next. Agile is flexible, iterative, and allows for changes throughout development. Agile focuses on collaboration and customer feedback, while Waterfall relies on upfront planning.

**Q4:** What is a sprint in Scrum?  
**A:** A sprint is a time-boxed iteration (usually 1–4 weeks) in Scrum during which a team works to complete a set of tasks from the sprint backlog and deliver a potentially shippable product increment.

**Q5:** What is the role of a Scrum Master?  
**A:** The Scrum Master facilitates Scrum processes, removes impediments, coaches the team, and ensures that Scrum practices are followed.

### ✅ Advanced Questions
**Q6:** How does the V-Model ensure quality?  
**A:** The V-Model ensures quality by pairing each development phase with a corresponding testing phase, allowing for early test planning and defect prevention.

**Q7:** Explain the Spiral model with an example.  
**A:** The Spiral model combines iterative development with risk analysis. For example, in large enterprise systems, each cycle involves planning, risk analysis, engineering, and evaluation, allowing for risk management and refinement.

**Q8:** What are the challenges in Agile testing?  
**A:** Challenges include adapting to changing requirements, maintaining test automation, integrating testing into short sprints, and ensuring continuous feedback.

**Q9:** How do you handle changing requirements in Agile?  
**A:** Agile welcomes changing requirements by maintaining a flexible backlog, prioritizing work, and collaborating closely with stakeholders to adapt plans as needed.

**Q10:** What is velocity in Agile?  
**A:** Velocity is a metric that measures the amount of work a team completes in a sprint, usually in story points. It helps forecast future work and sprint planning.

### ✅ Tricky Questions
**Q11:** Can Agile be used in fixed scope projects?  
**A:** Yes, Agile can be adapted for fixed scope projects by defining a clear backlog and focusing on delivering value incrementally, but flexibility may be limited.

**Q12:** How do you measure success in Agile?  
**A:** Success is measured by customer satisfaction, delivery of working software, team collaboration, and the ability to adapt to change.

**Q13:** What if a team member consistently misses standups?  
**A:** Address the issue privately, understand the reason, and emphasize the importance of standups for team communication and progress.

**Q14:** How do you manage technical debt in Agile?  
**A:** Technical debt is managed by allocating time for refactoring, including debt items in the backlog, and maintaining high code quality standards.

**Q15:** What’s the difference between Scrum and Kanban?  
**A:** Scrum uses time-boxed sprints, defined roles, and ceremonies. Kanban focuses on visualizing workflow, limiting work in progress, and continuous delivery without fixed iterations.

### ✅ More Basic Questions
**Q16:** What are the four values of the Agile Manifesto?  
**A:** 1) Individuals and interactions over processes and tools, 2) Working software over comprehensive documentation, 3) Customer collaboration over contract negotiation, 4) Responding to change over following a plan.

**Q17:** What is a user story? Give an example.  
**A:** A user story describes a feature from the user's perspective. Example: "As a shopper, I want to filter products by price so that I can find affordable items quickly."

**Q18:** What is the Definition of Done?  
**A:** The Definition of Done is a set of criteria that must be met for a user story or product increment to be considered complete, such as coding, testing, and review.

**Q19:** What is a burndown chart?  
**A:** A burndown chart visually tracks the remaining work in a sprint or project, helping teams monitor progress and predict completion.

**Q20:** What is the role of QA in Agile?  
**A:** QA collaborates with developers, automates tests, performs exploratory and acceptance testing, and ensures quality throughout the development cycle.

### ✅ More Advanced Questions
**Q21:** How do you estimate story points in Agile?  
**A:** Story points are estimated using techniques like Planning Poker, considering complexity, effort, and risk. The team discusses and agrees on point values for each story.

**Q22:** What is the INVEST model?  
**A:** INVEST stands for Independent, Negotiable, Valuable, Estimable, Small, Testable—qualities of a good user story.

**Q23:** How do you handle incomplete stories at the end of a sprint?  
**A:** Incomplete stories are returned to the backlog, re-prioritized, and planned for future sprints. Only completed stories count toward velocity.

**Q24:** What is continuous integration?  
**A:** Continuous integration is the practice of frequently merging code changes into a shared repository, automatically building and testing to detect issues early.

**Q25:** What are common Agile anti-patterns?  
**A:** Common anti-patterns include Scrumbut (partial Scrum adoption), micromanagement, skipping retrospectives, and lack of collaboration.

### ✅ More Tricky Questions
**Q26:** How do you deal with a Product Owner who keeps changing requirements?  
**A:** Communicate the impact of changes, prioritize backlog items, and use sprint boundaries to manage scope. Encourage the Product Owner to focus on value and stability.

**Q27:** What if the team velocity drops suddenly?  
**A:** Investigate causes such as team changes, technical debt, or external factors. Address issues in retrospectives and adjust planning as needed.

**Q28:** How do you handle conflicts in an Agile team?  
**A:** Facilitate open communication, encourage collaboration, and use retrospectives to resolve conflicts constructively.

**Q29:** Can you run Agile without daily standups?  
**A:** While daily standups are recommended for communication, Agile can be adapted if the team finds alternative ways to stay aligned and share progress.

**Q30:** How do you scale Agile for large organizations?  
**A:** Use frameworks like SAFe, LeSS, or Scrum@Scale, establish cross-team coordination, and maintain Agile principles at all levels.

