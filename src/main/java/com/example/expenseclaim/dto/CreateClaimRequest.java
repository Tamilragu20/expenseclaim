package com.example.expenseclaim.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public class CreateClaimRequest {

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Claim date is required")
    private LocalDate claimDate;

    @NotBlank(message = "Claim description is required")
    private String description;

    @NotEmpty(message = "At least one expense item is required")
    @Valid
    private List<ExpenseItemRequest> expenseItems;

    public CreateClaimRequest() {
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public LocalDate getClaimDate() {
        return claimDate;
    }

    public void setClaimDate(LocalDate claimDate) {
        this.claimDate = claimDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<ExpenseItemRequest> getExpenseItems() {
        return expenseItems;
    }

    public void setExpenseItems(List<ExpenseItemRequest> expenseItems) {
        this.expenseItems = expenseItems;
    }
}