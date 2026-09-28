package com.example.expenseclaim.controller;

import com.example.expenseclaim.dto.CreateEmployeeRequest;
import com.example.expenseclaim.entity.Employee;
import com.example.expenseclaim.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
public class EmployeeCtrl {

    private final EmployeeService employeeService;

    public EmployeeCtrl(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping
    public ResponseEntity<Employee> createEmployee(
            @Valid @RequestBody CreateEmployeeRequest request) {

        Employee employee = employeeService.createEmployee(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(employee);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployee(@PathVariable Long id) {
        return ResponseEntity.ok(
                employeeService.getEmployeeById(id)
        );
    }

    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(
                employeeService.getAllEmployees()
        );
    }
}