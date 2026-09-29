package com.example.expenseclaim.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.expenseclaim.dto.CreateClaimRequest;
import com.example.expenseclaim.entity.Claim;
import com.example.expenseclaim.service.ClaimService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/claims")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PostMapping
    public ResponseEntity<Claim> createClaim(
            @Valid @RequestBody CreateClaimRequest request) {

        Claim claim = claimService.createClaim(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(claim);
    }

    @GetMapping
    public ResponseEntity<List<Claim>> getAllClaims() {

        return ResponseEntity.ok(
                claimService.getAllClaims()
        );
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Long>> getClaimSummary() {

        return ResponseEntity.ok(
                claimService.getClaimSummary()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Claim> getClaim(@PathVariable Long id) {

        return ResponseEntity.ok(
                claimService.getClaimById(id)
        );
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Claim>> getClaimsByEmployee(
            @PathVariable Long employeeId) {

        return ResponseEntity.ok(
                claimService.getClaimsByEmployee(employeeId)
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Claim>> getClaimsByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                claimService.getClaimsByStatus(status)
        );
    }
}