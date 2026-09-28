package com.example.expenseclaim.service;

import com.example.expenseclaim.dto.ManagerApprovalRequest;
import com.example.expenseclaim.entity.ApprovalStep;
import com.example.expenseclaim.entity.Claim;
import com.example.expenseclaim.exception.BusinessRuleException;
import com.example.expenseclaim.repository.ApprovalStepRepository;
import com.example.expenseclaim.repository.ClaimRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApprovalService {

    private final ClaimRepository claimRepository;
    private final ApprovalStepRepository approvalStepRepository;

    public ApprovalService(
            ClaimRepository claimRepository,
            ApprovalStepRepository approvalStepRepository) {

        this.claimRepository = claimRepository;
        this.approvalStepRepository = approvalStepRepository;
    }

    @Transactional
    public Claim approveClaim(
            Long claimId,
            ManagerApprovalRequest request) {

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() ->
                        new BusinessRuleException(
                                "Claim not found with ID: " + claimId
                        ));

        if (!"PENDING_MANAGER_APPROVAL"
                .equals(claim.getStatus())) {

            throw new BusinessRuleException(
                    "Only claims pending manager approval can be approved."
            );
        }

        boolean hasFlaggedItem = claim.getExpenseItems()
                .stream()
                .anyMatch(item -> item.isFlagged());

        if (hasFlaggedItem && !request.isManagerOverride()) {

            throw new BusinessRuleException(
                    "Manager override is required because one or more "
                            + "expense items exceed the category policy limit."
            );
        }

        claim.setManagerOverride(request.isManagerOverride());
        claim.setStatus("APPROVED");

        ApprovalStep approvalStep = new ApprovalStep();

        approvalStep.setClaim(claim);
        approvalStep.setApproverName(request.getManagerName());
        approvalStep.setStage("MANAGER");
        approvalStep.setDecision("APPROVED");
        approvalStep.setRemarks(request.getRemarks());
        approvalStep.setApprovedAt(LocalDateTime.now());

        approvalStepRepository.save(approvalStep);

        return claimRepository.save(claim);
    }

    @Transactional
    public Claim rejectClaim(
            Long claimId,
            ManagerApprovalRequest request) {

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() ->
                        new BusinessRuleException(
                                "Claim not found with ID: " + claimId
                        ));

        if (!"PENDING_MANAGER_APPROVAL"
                .equals(claim.getStatus())) {

            throw new BusinessRuleException(
                    "Only claims pending manager approval can be rejected."
            );
        }

        claim.setStatus("REJECTED");

        ApprovalStep approvalStep = new ApprovalStep();

        approvalStep.setClaim(claim);
        approvalStep.setApproverName(request.getManagerName());
        approvalStep.setStage("MANAGER");
        approvalStep.setDecision("REJECTED");
        approvalStep.setRemarks(request.getRemarks());
        approvalStep.setApprovedAt(LocalDateTime.now());

        approvalStepRepository.save(approvalStep);

        return claimRepository.save(claim);
    }

    public List<ApprovalStep> getApprovalSteps(Long claimId) {

        return approvalStepRepository.findByClaimId(claimId);
    }
}