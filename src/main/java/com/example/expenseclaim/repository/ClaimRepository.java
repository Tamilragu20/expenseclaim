package com.example.expenseclaim.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.expenseclaim.entity.Claim;

public interface ClaimRepository extends JpaRepository<Claim, Long> {

    List<Claim> findByEmployeeId(Long employeeId);

    List<Claim> findByStatus(String status);
}