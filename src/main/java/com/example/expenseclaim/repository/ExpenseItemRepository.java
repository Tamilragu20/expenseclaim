package com.example.expenseclaim.repository;

import com.example.expenseclaim.entity.ExpenseItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseItemRepository extends JpaRepository<ExpenseItem, Long> {

    List<ExpenseItem> findByClaimId(Long claimId);

    List<ExpenseItem> findByClaimIdAndFlaggedTrue(Long claimId);
}