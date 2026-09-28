package com.example.expenseclaim.service;

import com.example.expenseclaim.dto.PaymentRequest;
import com.example.expenseclaim.entity.ApprovalStep;
import com.example.expenseclaim.entity.Claim;
import com.example.expenseclaim.exception.BusinessRuleException;
import com.example.expenseclaim.repository.ApprovalStepRepository;
import com.example.expenseclaim.repository.ClaimRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class FinanceService {

    private final ClaimRepository claimRepository;
    private final ApprovalStepRepository approvalStepRepository;

    public FinanceService(
            ClaimRepository claimRepository,
            ApprovalStepRepository approvalStepRepository) {

        this.claimRepository = claimRepository;
        this.approvalStepRepository = approvalStepRepository;
    }

    @Transactional
    public Claim markClaimAsPaid(
            Long claimId,
            PaymentRequest request) {

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() ->
                        new BusinessRuleException(
                                "Claim not found with ID: " + claimId
                        ));

        if (!"APPROVED".equals(claim.getStatus())) {

            throw new BusinessRuleException(
                    "Finance can mark a claim as paid only after manager approval."
            );
        }

        claim.setStatus("PAID");

        ApprovalStep paymentStep = new ApprovalStep();

        paymentStep.setClaim(claim);
        paymentStep.setApproverName("FINANCE");
        paymentStep.setStage("FINANCE");
        paymentStep.setDecision("PAID");
        paymentStep.setRemarks(
                "Payment Reference: " + request.getPaymentReference()
        );
        paymentStep.setApprovedAt(LocalDateTime.now());

        approvalStepRepository.save(paymentStep);

        return claimRepository.save(claim);
    }
}