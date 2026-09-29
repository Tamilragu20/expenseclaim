package com.example.expenseclaim.service;

import com.example.expenseclaim.dto.CreateClaimRequest;
import com.example.expenseclaim.dto.ExpenseItemRequest;
import com.example.expenseclaim.entity.Claim;
import com.example.expenseclaim.entity.Employee;
import com.example.expenseclaim.entity.ExpenseItem;
import com.example.expenseclaim.exception.ResourceNotFoundException;
import com.example.expenseclaim.repository.ClaimRepository;
import com.example.expenseclaim.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final EmployeeRepository employeeRepository;

    public ClaimService(
            ClaimRepository claimRepository,
            EmployeeRepository employeeRepository) {

        this.claimRepository = claimRepository;
        this.employeeRepository = employeeRepository;
    }

    @Transactional
    public Claim createClaim(CreateClaimRequest request) {

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with ID: "
                                        + request.getEmployeeId()
                        ));

        Claim claim = new Claim();

        claim.setEmployee(employee);
        claim.setClaimDate(request.getClaimDate());
        claim.setDescription(request.getDescription());
        claim.setStatus("PENDING_MANAGER_APPROVAL");
        claim.setManagerOverride(false);

        List<ExpenseItem> expenseItems = new ArrayList<>();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (ExpenseItemRequest itemRequest : request.getExpenseItems()) {

            ExpenseItem item = new ExpenseItem();

            item.setClaim(claim);
            item.setCategory(itemRequest.getCategory());
            item.setDescription(itemRequest.getDescription());
            item.setAmount(itemRequest.getAmount());

            BigDecimal policyLimit =
                    getPolicyLimit(itemRequest.getCategory());

            item.setPolicyLimit(policyLimit);

            boolean flagged =
                    itemRequest.getAmount().compareTo(policyLimit) > 0;

            item.setFlagged(flagged);

            expenseItems.add(item);

            totalAmount =
                    totalAmount.add(itemRequest.getAmount());
        }

        claim.setExpenseItems(expenseItems);
        claim.setTotalAmount(totalAmount);

        return claimRepository.save(claim);
    }

    private BigDecimal getPolicyLimit(String category) {

        return switch (category.toUpperCase()) {

            case "TRAVEL" ->
                    new BigDecimal("5000");

            case "FOOD" ->
                    new BigDecimal("1000");

            case "HOTEL" ->
                    new BigDecimal("4000");

            case "TRANSPORT" ->
                    new BigDecimal("2000");

            case "OTHER" ->
                    new BigDecimal("1500");

            default ->
                    new BigDecimal("1500");
        };
    }

    public Claim getClaimById(Long id) {

        return claimRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Claim not found with ID: " + id
                        ));
    }

    public List<Claim> getClaimsByEmployee(Long employeeId) {

        if (!employeeRepository.existsById(employeeId)) {

            throw new ResourceNotFoundException(
                    "Employee not found with ID: " + employeeId
            );
        }

        return claimRepository.findByEmployeeId(employeeId);
    }

    public List<Claim> getClaimsByStatus(String status) {

        return claimRepository.findByStatus(status);
    }

    public List<Claim> getAllClaims() {

        return claimRepository.findAll();
    }

    public Map<String, Long> getClaimSummary() {

        Map<String, Long> summary = new HashMap<>();

        summary.put("totalClaims", claimRepository.count());
        summary.put(
                "pendingManagerApproval",
                claimRepository.countByStatus("PENDING_MANAGER_APPROVAL")
        );
        summary.put(
                "approved",
                claimRepository.countByStatus("APPROVED")
        );
        summary.put(
                "rejected",
                claimRepository.countByStatus("REJECTED")
        );
        summary.put(
                "paid",
                claimRepository.countByStatus("PAID")
        );

        return summary;
    }
}