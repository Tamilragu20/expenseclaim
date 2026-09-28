package com.example.expenseclaim.controller;

import com.example.expenseclaim.dto.CreateClaimRequest;
import com.example.expenseclaim.entity.Claim;
import com.example.expenseclaim.service.ClaimService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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