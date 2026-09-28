package com.example.expenseclaim.controller;

import com.example.expenseclaim.dto.PaymentRequest;
import com.example.expenseclaim.entity.Claim;
import com.example.expenseclaim.service.FinanceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/finance")
public class FinanceController {

    private final FinanceService financeService;

    public FinanceController(FinanceService financeService) {
        this.financeService = financeService;
    }

    @PutMapping("/claims/{claimId}/pay")
    public ResponseEntity<Claim> markClaimAsPaid(
            @PathVariable Long claimId,
            @Valid @RequestBody PaymentRequest request) {

        return ResponseEntity.ok(
                financeService.markClaimAsPaid(claimId, request)
        );
    }
}