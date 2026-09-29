const API = "";


/* =========================================================
   COMMON RESULT HELPERS
   ========================================================= */

function showSuccess(elementId, title, message) {

    const element = document.getElementById(elementId);

    element.innerHTML = `
        <div class="success-message">
            <strong>✓ ${title}</strong>
            <p>${message}</p>
        </div>
    `;
}


function showError(elementId, message) {

    const element = document.getElementById(elementId);

    element.innerHTML = `
        <div class="error-message">
            <strong>⚠ Something went wrong</strong>
            <p>${message}</p>
        </div>
    `;
}


function getErrorMessage(data) {

    if (data && data.message) {
        return data.message;
    }

    if (data && data.error) {
        return data.error;
    }

    return "Unable to complete the request.";
}


/* =========================================================
   DASHBOARD SUMMARY
   ========================================================= */

async function loadDashboardSummary() {

    try {

        const response = await fetch(
            `${API}/claims/summary`
        );

        const data = await response.json();


        if (!response.ok) {

            showError(
                "dashboardResult",
                getErrorMessage(data)
            );

            return;
        }


        document.getElementById("totalClaimsCount").textContent =
            data.totalClaims;

        document.getElementById("pendingClaimsCount").textContent =
            data.pendingManagerApproval;

        document.getElementById("approvedClaimsCount").textContent =
            data.approved;

        document.getElementById("rejectedClaimsCount").textContent =
            data.rejected;

        document.getElementById("paidClaimsCount").textContent =
            data.paid;


    } catch (error) {

        showError(
            "dashboardResult",
            "Unable to load dashboard data."
        );

    }
}


/* =========================================================
   EMPLOYEE MANAGEMENT
   ========================================================= */

async function addEmployee() {

    const name =
        document.getElementById("employeeName").value.trim();

    const email =
        document.getElementById("employeeEmail").value.trim();

    const department =
        document.getElementById("employeeDepartment").value.trim();

    const managerName =
        document.getElementById("employeeManager").value.trim();


    if (!name || !email || !department || !managerName) {

        showError(
            "employeeResult",
            "Please fill in all employee details."
        );

        return;
    }


    const employeeData = {

        name: name,

        email: email,

        department: department,

        managerName: managerName

    };


    try {

        const response = await fetch(
            `${API}/employees`,
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(employeeData)

            }
        );


        const data = await response.json();


        if (!response.ok) {

            showError(
                "employeeResult",
                getErrorMessage(data)
            );

            return;
        }


        showSuccess(
            "employeeResult",
            "Employee Added Successfully",
            `Employee <strong>${data.name}</strong> has been added.
             Employee ID: <strong>${data.id}</strong>`
        );


        document.getElementById("employeeName").value = "";

        document.getElementById("employeeEmail").value = "";

        document.getElementById("employeeDepartment").value = "";

        document.getElementById("employeeManager").value = "";


    } catch (error) {

        showError(
            "employeeResult",
            "Unable to connect to the server."
        );

    }
}


/* =========================================================
   VIEW EMPLOYEE
   ========================================================= */

async function loadEmployee() {

    const employeeId =
        document.getElementById("employeeId").value;


    if (!employeeId) {

        showError(
            "employeeDetails",
            "Please enter an employee ID."
        );

        return;
    }


    try {

        const response = await fetch(
            `${API}/employees/${employeeId}`
        );


        const data = await response.json();


        if (!response.ok) {

            showError(
                "employeeDetails",
                getErrorMessage(data)
            );

            return;
        }


        document.getElementById("employeeDetails").innerHTML = `

            <div class="employee-result-card">

                <strong>✓ Employee Found</strong>

                <div class="details-grid">

                    <p>
                        <b>ID:</b>
                        ${data.id}
                    </p>

                    <p>
                        <b>Name:</b>
                        ${data.name}
                    </p>

                    <p>
                        <b>Email:</b>
                        ${data.email}
                    </p>

                    <p>
                        <b>Department:</b>
                        ${data.department}
                    </p>

                    <p>
                        <b>Manager:</b>
                        ${data.managerName}
                    </p>

                </div>

            </div>

        `;


    } catch (error) {

        showError(
            "employeeDetails",
            "Unable to connect to the server."
        );

    }
}


/* =========================================================
   VIEW EMPLOYEE CLAIMS
   ========================================================= */

async function loadEmployeeClaims() {

    const employeeId =
        document.getElementById("employeeClaimsId").value;


    if (!employeeId) {

        showError(
            "employeeClaimsResult",
            "Please enter an employee ID."
        );

        return;
    }


    try {

        const response = await fetch(
            `${API}/claims/employee/${employeeId}`
        );


        const data = await response.json();


        if (!response.ok) {

            showError(
                "employeeClaimsResult",
                getErrorMessage(data)
            );

            return;
        }


        if (!Array.isArray(data) || data.length === 0) {

            document.getElementById(
                "employeeClaimsResult"
            ).innerHTML = `

                <div class="employee-result-card">

                    <strong>📋 No Claims Found</strong>

                    <p>
                        This employee has not submitted any expense claims.
                    </p>

                </div>

            `;

            return;
        }


        let claimsHTML = `

            <div class="employee-result-card">

                <strong>📋 Employee Claims</strong>

                <div class="claim-list">

        `;


        data.forEach(claim => {

            let statusClass = "pending";


            if (claim.status === "APPROVED") {

                statusClass = "approved";

            }

            else if (claim.status === "REJECTED") {

                statusClass = "rejected";

            }

            else if (claim.status === "PAID") {

                statusClass = "paid";

            }


            let flaggedText = "No";


            if (
                claim.expenseItems &&
                claim.expenseItems.some(
                    item => item.flagged
                )
            ) {

                flaggedText = "Yes";

            }


            claimsHTML += `

                <div class="claim-item">

                    <div class="claim-item-header">

                        <strong>
                            Claim #${claim.id}
                        </strong>

                        <span class="status ${statusClass}">
                            ● ${claim.status}
                        </span>

                    </div>


                    <div class="claim-details">

                        <p>
                            <b>Date:</b>
                            ${claim.claimDate}
                        </p>

                        <p>
                            <b>Description:</b>
                            ${claim.description}
                        </p>

                        <p>
                            <b>Total Amount:</b>
                            ₹${claim.totalAmount}
                        </p>

                        <p>
                            <b>Policy Flag:</b>
                            ${flaggedText}
                        </p>

                    </div>

                </div>

            `;

        });


        claimsHTML += `

                </div>

            </div>

        `;


        document.getElementById(
            "employeeClaimsResult"
        ).innerHTML = claimsHTML;


    } catch (error) {

        showError(
            "employeeClaimsResult",
            "Unable to connect to the server."
        );

    }
}


/* =========================================================
   CREATE EXPENSE CLAIM
   ========================================================= */

async function createClaim() {

    const employeeId =
        document.getElementById("claimEmployeeId").value;


    const description =
        document.getElementById("claimDescription").value.trim();


    const category =
        document.getElementById("category").value;


    const expenseDescription =
        document.getElementById("expenseDescription").value.trim();


    const amount =
        document.getElementById("amount").value;


    if (
        !employeeId ||
        !description ||
        !category ||
        !expenseDescription ||
        !amount
    ) {

        showError(
            "claimResult",
            "Please fill in all claim details."
        );

        return;
    }


    if (Number(amount) <= 0) {

        showError(
            "claimResult",
            "Expense amount must be greater than zero."
        );

        return;
    }


    const claimData = {

        employeeId: Number(employeeId),

        claimDate:
            new Date().toISOString().split("T")[0],

        description: description,

        expenseItems: [

            {

                category: category,

                description: expenseDescription,

                amount: Number(amount)

            }

        ]

    };


    try {

        const response = await fetch(
            `${API}/claims`,
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(claimData)

            }
        );


        const data = await response.json();


        if (!response.ok) {

            showError(
                "claimResult",
                getErrorMessage(data)
            );

            return;
        }


        showSuccess(
            "claimResult",
            "Expense Claim Submitted",
            `
                Claim ID:
                <strong>${data.id}</strong>
                <br>

                Total Amount:
                <strong>₹${data.totalAmount}</strong>
                <br>

                Status:
                <strong>${data.status}</strong>
            `
        );


        document.getElementById(
            "claimDescription"
        ).value = "";


        document.getElementById(
            "category"
        ).value = "";


        document.getElementById(
            "expenseDescription"
        ).value = "";


        document.getElementById(
            "amount"
        ).value = "";


        // Refresh dashboard after creating claim
        loadDashboardSummary();


    } catch (error) {

        showError(
            "claimResult",
            "Unable to connect to the server."
        );

    }
}


/* =========================================================
   GET CLAIM STATUS
   ========================================================= */

async function getClaim() {

    const claimId =
        document.getElementById("claimId").value;


    if (!claimId) {

        showError(
            "claimStatus",
            "Please enter a claim ID."
        );

        return;
    }


    try {

        const response = await fetch(
            `${API}/claims/${claimId}`
        );


        const data = await response.json();


        if (!response.ok) {

            showError(
                "claimStatus",
                getErrorMessage(data)
            );

            return;
        }


        let statusClass = "pending";


        if (data.status === "APPROVED") {

            statusClass = "approved";

        }

        else if (data.status === "REJECTED") {

            statusClass = "rejected";

        }

        else if (data.status === "PAID") {

            statusClass = "paid";

        }


        document.getElementById("claimStatus").innerHTML = `

            <div class="claim-status-card">

                <strong>Claim #${data.id}</strong>

                <div class="claim-details">

                    <p>
                        <b>Description:</b>
                        ${data.description}
                    </p>

                    <p>
                        <b>Total Amount:</b>
                        ₹${data.totalAmount}
                    </p>

                    <p>
                        <b>Status:</b>

                        <span class="status ${statusClass}">
                            ● ${data.status}
                        </span>

                    </p>

                    <p>
                        <b>Manager Override:</b>
                        ${data.managerOverride ? "Yes" : "No"}
                    </p>

                </div>

            </div>

        `;


    } catch (error) {

        showError(
            "claimStatus",
            "Unable to connect to the server."
        );

    }
}


/* =========================================================
   MANAGER APPROVAL
   ========================================================= */

async function approveClaim() {

    const claimId =
        document.getElementById("approvalClaimId").value;


    const managerName =
        document.getElementById("managerName").value.trim();


    const remarks =
        document.getElementById("approvalRemarks").value.trim();


    const managerOverride =
        document.getElementById("managerOverride").checked;


    if (!claimId || !managerName) {

        showError(
            "approvalResult",
            "Please enter Claim ID and Manager Name."
        );

        return;
    }


    const approvalData = {

        managerName: managerName,

        remarks:
            remarks || "Claim approved by manager.",

        managerOverride:
            managerOverride

    };


    try {

        const response = await fetch(
            `${API}/claims/${claimId}/approve`,
            {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(approvalData)

            }
        );


        const data = await response.json();


        if (!response.ok) {

            showError(
                "approvalResult",
                getErrorMessage(data)
            );

            return;
        }


        showSuccess(
            "approvalResult",
            "Claim Approved",
            `
                Claim
                <strong>#${data.id}</strong>
                has been approved successfully.
                <br>

                Current Status:
                <strong>${data.status}</strong>
            `
        );


        document.getElementById(
            "approvalClaimId"
        ).value = "";


        document.getElementById(
            "managerName"
        ).value = "";


        document.getElementById(
            "approvalRemarks"
        ).value = "";


        document.getElementById(
            "managerOverride"
        ).checked = false;


        // Refresh dashboard after approval
        loadDashboardSummary();


    } catch (error) {

        showError(
            "approvalResult",
            "Unable to connect to the server."
        );

    }
}


/* =========================================================
   MANAGER REJECTION
   ========================================================= */

async function rejectClaim() {

    const claimId =
        document.getElementById("approvalClaimId").value;


    const managerName =
        document.getElementById("managerName").value.trim();


    const remarks =
        document.getElementById("approvalRemarks").value.trim();


    if (!claimId || !managerName) {

        showError(
            "approvalResult",
            "Please enter Claim ID and Manager Name."
        );

        return;
    }


    const rejectionData = {

        managerName: managerName,

        remarks:
            remarks || "Claim rejected by manager.",

        managerOverride: false

    };


    try {

        const response = await fetch(
            `${API}/claims/${claimId}/reject`,
            {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(rejectionData)

            }
        );


        const data = await response.json();


        if (!response.ok) {

            showError(
                "approvalResult",
                getErrorMessage(data)
            );

            return;
        }


        showSuccess(
            "approvalResult",
            "Claim Rejected",
            `
                Claim
                <strong>#${data.id}</strong>
                has been rejected successfully.
                <br>

                Current Status:
                <strong>${data.status}</strong>
            `
        );


        document.getElementById(
            "approvalClaimId"
        ).value = "";


        document.getElementById(
            "managerName"
        ).value = "";


        document.getElementById(
            "approvalRemarks"
        ).value = "";


        document.getElementById(
            "managerOverride"
        ).checked = false;


        // Refresh dashboard after rejection
        loadDashboardSummary();


    } catch (error) {

        showError(
            "approvalResult",
            "Unable to connect to the server."
        );

    }
}


/* =========================================================
   FINANCE PAYMENT
   ========================================================= */

async function payClaim() {

    const claimId =
        document.getElementById("paymentClaimId").value;


    const paymentReference =
        document.getElementById("paymentReference").value.trim();


    if (!claimId || !paymentReference) {

        showError(
            "paymentResult",
            "Please enter Claim ID and Payment Reference."
        );

        return;
    }


    const paymentData = {

        paymentReference:
            paymentReference

    };


    try {

        const response = await fetch(
            `${API}/finance/claims/${claimId}/pay`,
            {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(paymentData)

            }
        );


        const data = await response.json();


        if (!response.ok) {

            showError(
                "paymentResult",
                getErrorMessage(data)
            );

            return;
        }


        showSuccess(
            "paymentResult",
            "Payment Completed",
            `
                Claim
                <strong>#${data.id}</strong>
                has been marked as
                <strong>PAID</strong>.
                <br>

                Payment Reference:
                <strong>${paymentReference}</strong>
            `
        );


        document.getElementById(
            "paymentClaimId"
        ).value = "";


        document.getElementById(
            "paymentReference"
        ).value = "";


        // Refresh dashboard after payment
        loadDashboardSummary();


    } catch (error) {

        showError(
            "paymentResult",
            "Unable to connect to the server."
        );

    }
}


/* =========================================================
   LOAD DASHBOARD WHEN PAGE OPENS
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDashboardSummary();

    }
);