package com.example.expenseclaim.dto;

import jakarta.validation.constraints.NotBlank;

public class ManagerApprovalRequest {

    @NotBlank(message = "Manager name is required")
    private String managerName;

    @NotBlank(message = "Remarks are required")
    private String remarks;

    private boolean managerOverride;

    public ManagerApprovalRequest() {
    }

    public String getManagerName() {
        return managerName;
    }

    public void setManagerName(String managerName) {
        this.managerName = managerName;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public boolean isManagerOverride() {
        return managerOverride;
    }

    public void setManagerOverride(boolean managerOverride) {
        this.managerOverride = managerOverride;
    }
}