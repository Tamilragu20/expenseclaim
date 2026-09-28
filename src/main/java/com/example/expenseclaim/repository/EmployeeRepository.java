package com.example.expenseclaim.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.expenseclaim.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}