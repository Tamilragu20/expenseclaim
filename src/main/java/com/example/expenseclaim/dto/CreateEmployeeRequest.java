package com.example.expenseclaim.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class CreateEmployeeRequest {

    @NotBlank(message = "Employee name is required")
    private String name;

    @NotBlank(message = "Employee email is required")
    @Email(message = "Enter a valid email address")
    private String email;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Manager name is required")
    private String managerName;

    public CreateEmployeeRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getManagerName() {
        return managerName;
    }

    public void setManagerName(String managerName) {
        this.managerName = managerName;
    }
}