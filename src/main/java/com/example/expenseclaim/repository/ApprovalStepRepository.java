package com.example.expenseclaim.repository;

import com.example.expenseclaim.entity.ApprovalStep;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApprovalStepRepository extends JpaRepository<ApprovalStep, Long> {

    List<ApprovalStep> findByClaimId(Long claimId);

    List<ApprovalStep> findByStage(String stage);
}