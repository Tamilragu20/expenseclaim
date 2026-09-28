# Expense Claim Management System

A Spring Boot-based RESTful application designed to manage employee expense claims, itemized expenses, approvals, and reimbursements.

---

## 🚀 Features

- **Employee Management**: Register employees with department and reporting manager details.
- **Expense Claim Submission**: Submit expense claims with descriptions, submission dates, and individual itemized expenses.
- **Itemized Expenses**: Track expense items including category, description, and amount.
- **Approval Workflow**: Multi-step manager approvals and payment processing.
- **Relational Persistence**: MySQL database integration with Spring Data JPA & Hibernate.

---

## 🛠️ Tech Stack

- **Java**: 17+
- **Framework**: Spring Boot 4.x
- **ORM / Persistence**: Spring Data JPA, Hibernate
- **Database**: MySQL
- **Build Tool**: Apache Maven

---

## 📂 Project Structure

```text
├── src
│   ├── main
│   │   ├── java/com/example/expenseclaim
│   │   │   ├── controller       # REST endpoints
│   │   │   ├── dto              # Data Transfer Objects
│   │   │   ├── entity           # JPA entities (Employee, Claim, ExpenseItem, ApprovalStep)
│   │   │   ├── exception        # Custom exception handlers
│   │   │   ├── repository       # Spring Data JPA repositories
│   │   │   ├── service          # Business logic layer
│   │   │   └── ExpenseclaimApplication.java
│   │   └── resources
│   │       └── application.properties
│   └── test
├── pom.xml
└── README.md
```

---

## ⚙️ Configuration & Setup

### 1. Database Configuration
Ensure MySQL is running on `localhost:3306` and create the database:

```sql
CREATE DATABASE expenseclaim;
```

Update your `src/main/resources/application.properties` if needed:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/expenseclaim
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### 2. Build and Run

Run using Maven:

```bash
./mvnw clean spring-boot:run
```

Or on Windows:

```cmd
mvnw.cmd clean spring-boot:run
```

The application will start on port `8080`.
