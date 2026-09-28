package com.example.expenseclaim.controller;

import com.example.expenseclaim.dto.ManagerApprovalRequest;
import com.example.expenseclaim.entity.ApprovalStep;
import com.example.expenseclaim.entity.Claim;
import com.example.expenseclaim.service.ApprovalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/claims")
public class ApprovalCtrl {

    private final ApprovalService approvalService;

    public ApprovalCtrl(ApprovalService approvalService) {
        this.approvalService = approvalService;
    }

    @PutMapping("/{claimId}/approve")
    public ResponseEntity<Claim> approveClaim(
            @PathVariable Long claimId,
            @Valid @RequestBody ManagerApprovalRequest request) {

        return ResponseEntity.ok(
                approvalService.approveClaim(claimId, request)
        );
    }

    @PutMapping("/{claimId}/reject")
    public ResponseEntity<Claim> rejectClaim(
            @PathVariable Long claimId,
            @Valid @RequestBody ManagerApprovalRequest request) {

        return ResponseEntity.ok(
                approvalService.rejectClaim(claimId, request)
        );
    }

    @GetMapping("/{claimId}/approvals")
    public ResponseEntity<List<ApprovalStep>> getApprovalSteps(
            @PathVariable Long claimId) {

        return ResponseEntity.ok(
                approvalService.getApprovalSteps(claimId)
        );
    }
}