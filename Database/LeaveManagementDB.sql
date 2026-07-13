-- ============================================================
-- Final Project - Leave Management System
-- Database: SQL Server
-- Tables: Departments, Users, Employees, LeaveTypes, LeaveRequests
-- Run this whole file in SQL Server (one script)
-- ============================================================


-- STEP 1: Create Database
-- ============================================================

CREATE DATABASE LeaveManagement;

USE LeaveManagement;


-- STEP 2: Drop Old Tables (if you run script again)
-- ============================================================

IF OBJECT_ID('FK_Users_Employees', 'F') IS NOT NULL
    ALTER TABLE Users DROP CONSTRAINT FK_Users_Employees;

IF OBJECT_ID('LeaveRequests', 'U') IS NOT NULL
    DROP TABLE LeaveRequests;

IF OBJECT_ID('Employees', 'U') IS NOT NULL
    DROP TABLE Employees;

IF OBJECT_ID('LeaveTypes', 'U') IS NOT NULL
    DROP TABLE LeaveTypes;

IF OBJECT_ID('Users', 'U') IS NOT NULL
    DROP TABLE Users;

IF OBJECT_ID('Departments', 'U') IS NOT NULL
    DROP TABLE Departments;


-- STEP 3: Create Tables
-- ============================================================

-- Table 1: Departments
CREATE TABLE Departments
(
    DepartmentId INT PRIMARY KEY IDENTITY(1,1),
    DepartmentName VARCHAR(100) NOT NULL UNIQUE,
    Description VARCHAR(255) NULL
);


-- Table 2: Users
-- Login for Admin, HR, and Employees
-- EmployeeId links portal login to employee (set after employee is created)
CREATE TABLE Users
(
    UserId INT PRIMARY KEY IDENTITY(1,1),
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(100) NOT NULL,
    Role VARCHAR(20) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    EmployeeId INT NULL
);


-- Table 3: Employees
-- Created first; UserId is added when portal login is created
CREATE TABLE Employees
(
    EmployeeId INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NULL,
    DepartmentId INT NOT NULL,
    EmployeeCode VARCHAR(20) NOT NULL UNIQUE,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Phone VARCHAR(20) NULL,
    HireDate DATE NOT NULL,
    JobTitle VARCHAR(100) NOT NULL,

    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId)
);

CREATE UNIQUE NONCLUSTERED INDEX UQ_Employees_UserId
ON Employees(UserId)
WHERE UserId IS NOT NULL;


-- Link Users to Employees
ALTER TABLE Users
ADD CONSTRAINT FK_Users_Employees FOREIGN KEY (EmployeeId) REFERENCES Employees(EmployeeId);


-- Table 4: LeaveTypes
CREATE TABLE LeaveTypes
(
    LeaveTypeId INT PRIMARY KEY IDENTITY(1,1),
    TypeName VARCHAR(50) NOT NULL UNIQUE,
    Description VARCHAR(255) NULL,
    MaxDaysPerYear INT NOT NULL,
    IsPaid BIT NOT NULL DEFAULT 1
);


-- Table 5: LeaveRequests
CREATE TABLE LeaveRequests
(
    LeaveRequestId INT PRIMARY KEY IDENTITY(1,1),
    EmployeeId INT NOT NULL,
    LeaveTypeId INT NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    TotalDays INT NOT NULL,
    Reason VARCHAR(500) NOT NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    RequestedAt DATETIME NOT NULL DEFAULT GETDATE(),
    ReviewedByUserId INT NULL,
    ReviewedAt DATETIME NULL,

    FOREIGN KEY (EmployeeId) REFERENCES Employees(EmployeeId),
    FOREIGN KEY (LeaveTypeId) REFERENCES LeaveTypes(LeaveTypeId),
    FOREIGN KEY (ReviewedByUserId) REFERENCES Users(UserId)
);


-- STEP 4: Insert Sample Data
-- ============================================================

INSERT INTO Departments (DepartmentName, Description)
VALUES
('Human Resources', 'Handles recruitment and employee welfare'),
('Information Technology', 'Software development and IT support'),
('Finance', 'Accounting and financial planning'),
('Marketing', 'Promotion and brand management');


INSERT INTO Users (Username, Email, Password, Role, IsActive)
VALUES
('admin', 'admin@company.com', 'Admin@123', 'Admin', 1),
('hr_manager', 'hr@company.com', 'HR@123', 'HR', 1),
('john_doe', 'john.doe@company.com', 'Employee@123', 'Employee', 1),
('jane_smith', 'jane.smith@company.com', 'Employee@123', 'Employee', 1),
('mike_wilson', 'mike.wilson@company.com', 'Employee@123', 'Employee', 1);


INSERT INTO Employees (UserId, DepartmentId, EmployeeCode, FirstName, LastName, Phone, HireDate, JobTitle)
VALUES
(3, 2, 'EMP001', 'John', 'Doe', '0771234567', '2022-01-15', 'Software Developer'),
(4, 4, 'EMP002', 'Jane', 'Smith', '0772345678', '2021-06-10', 'Marketing Executive'),
(5, 3, 'EMP003', 'Mike', 'Wilson', '0773456789', '2023-03-20', 'Accountant');


UPDATE Users SET EmployeeId = 1 WHERE UserId = 3;
UPDATE Users SET EmployeeId = 2 WHERE UserId = 4;
UPDATE Users SET EmployeeId = 3 WHERE UserId = 5;


INSERT INTO LeaveTypes (TypeName, Description, MaxDaysPerYear, IsPaid)
VALUES
('Annual Leave', 'Paid yearly vacation leave', 14, 1),
('Sick Leave', 'Leave for medical reasons', 10, 1),
('Casual Leave', 'Short personal leave', 7, 1),
('Unpaid Leave', 'Leave without salary', 30, 0);


INSERT INTO LeaveRequests (EmployeeId, LeaveTypeId, StartDate, EndDate, TotalDays, Reason, Status, ReviewedByUserId, ReviewedAt)
VALUES
(1, 1, '2026-07-01', '2026-07-05', 5, 'Family vacation', 'Approved', 2, '2026-06-10 10:30:00'),
(2, 2, '2026-06-15', '2026-06-16', 2, 'Fever and rest', 'Approved', 2, '2026-06-14 09:00:00'),
(3, 3, '2026-08-20', '2026-08-20', 1, 'Personal work', 'Pending', NULL, NULL),
(1, 2, '2026-09-01', '2026-09-02', 2, 'Doctor appointment', 'Pending', NULL, NULL);


-- STEP 5: Check Data
-- ============================================================

SELECT * FROM Departments;
SELECT * FROM Users;
SELECT * FROM Employees;
SELECT * FROM LeaveTypes;
SELECT * FROM LeaveRequests;