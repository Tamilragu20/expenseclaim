package com.example.expenseclaim.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.expenseclaim.dto.CreateEmployeeRequest;
import com.example.expenseclaim.entity.Employee;
import com.example.expenseclaim.exception.ResourceNotFoundException;
import com.example.expenseclaim.repository.EmployeeRepository;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public Employee createEmployee(CreateEmployeeRequest request) {

        Employee employee = new Employee();

        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setDepartment(request.getDepartment());
        employee.setManagerName(request.getManagerName());

        return employeeRepository.save(employee);
    }

    public Employee getEmployeeById(Long id) {

        return employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with ID: " + id
                        ));
    }

    public List<Employee> getAllEmployees() {

        return employeeRepository.findAll();
    }

    public void deleteEmployee(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with ID: " + id
                        ));

        employeeRepository.delete(employee);
    }

    public Employee updateEmployee(Long id, CreateEmployeeRequest request) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with ID: " + id
                        ));

        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setDepartment(request.getDepartment());
        employee.setManagerName(request.getManagerName());

        return employeeRepository.save(employee);
    }
}