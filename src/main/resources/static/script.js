const API = "";


// ===============================
// Load Employee
// ===============================

async function loadEmployee() {

    const employeeId = document.getElementById("employeeId").value;
    const result = document.getElementById("employeeDetails");

    try {

        const response = await fetch(
            `${API}/employees/${employeeId}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Employee not found");
        }

        result.innerHTML = `
            <p><strong>ID:</strong> ${data.id}</p>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Department:</strong> ${data.department}</p>
            <p><strong>Manager:</strong> ${data.managerName}</p>
        `;

    } catch (error) {

        result.innerHTML = `
            <p class="error">${error.message}</p>
        `;
    }
}


// ===============================
// Add Employee
// ===============================

async function addEmployee() {

    const name =
        document.getElementById("employeeName").value;

    const email =
        document.getElementById("employeeEmail").value;

    const department =
        document.getElementById("employeeDepartment").value;

    const managerName =
        document.getElementById("employeeManager").value;

    const result =
        document.getElementById("employeeResult");


    if (!name || !email || !department || !managerName) {

        result.innerHTML = `
            <p class="error">
                Please fill all employee details.
            </p>
        `;

        return;
    }


    const requestData = {

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

                body: JSON.stringify(requestData)
            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.message || "Failed to add employee"
            );
        }


        result.innerHTML = `
            <p class="success">
                Employee added successfully!
            </p>

            <p>
                <strong>Employee ID:</strong>
                ${data.id}
            </p>

            <p>
                <strong>Name:</strong>
                ${data.name}
            </p>

            <p>
                <strong>Email:</strong>
                ${data.email}
            </p>

            <p>
                <strong>Department:</strong>
                ${data.department}
            </p>

            <p>
                <strong>Manager:</strong>
                ${data.managerName}
            </p>
        `;


        // Clear form after successful creation

        document.getElementById("employeeName").value = "";
        document.getElementById("employeeEmail").value = "";
        document.getElementById("employeeDepartment").value = "";
        document.getElementById("employeeManager").value = "";


    } catch (error) {

        result.innerHTML = `
            <p class="error">
                ${error.message}
            </p>
        `;
    }
}


// ===============================
// Create Claim
// ===============================

async function createClaim() {

    const employeeId =
        document.getElementById("employeeId").value;

    const description =
        document.getElementById("claimDescription").value;

    const category =
        document.getElementById("category").value;

    const expenseDescription =
        document.getElementById("expenseDescription").value;

    const amount =
        document.getElementById("amount").value;

    const result =
        document.getElementById("claimResult");

    if (!description || !expenseDescription || !amount) {

        result.innerHTML = `
            <p class="error">
                Please fill all claim details.
            </p>
        `;

        return;
    }

    const today =
        new Date().toISOString().split("T")[0];

    const requestData = {

        employeeId: Number(employeeId),

        claimDate: today,

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

                body: JSON.stringify(requestData)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to create claim"
            );
        }


        result.innerHTML = `
            <p class="success">
                Claim created successfully!
            </p>

            <p>
                <strong>Claim ID:</strong>
                ${data.id}
            </p>

            <p>
                <strong>Total Amount:</strong>
                ₹${data.totalAmount}
            </p>

            <p>
                <strong>Status:</strong>
                ${data.status}
            </p>

            <p>
                <strong>Policy Limit:</strong>
                ₹${data.expenseItems[0].policyLimit}
            </p>

            <p>
                <strong>Flagged:</strong>
                ${data.expenseItems[0].flagged}
            </p>
        `;

    } catch (error) {

        result.innerHTML = `
            <p class="error">${error.message}</p>
        `;
    }
}


// ===============================
// Get Claim
// ===============================

async function getClaim() {

    const claimId =
        document.getElementById("claimId").value;

    const result =
        document.getElementById("claimDetails");


    if (!claimId) {

        result.innerHTML = `
            <p class="error">
                Please enter Claim ID.
            </p>
        `;

        return;
    }


    try {

        const response = await fetch(
            `${API}/claims/${claimId}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Claim not found"
            );
        }


        result.innerHTML = `
            <p><strong>Claim ID:</strong> ${data.id}</p>

            <p>
                <strong>Description:</strong>
                ${data.description}
            </p>

            <p>
                <strong>Total Amount:</strong>
                ₹${data.totalAmount}
            </p>

            <p>
                <strong>Status:</strong>
                ${data.status}
            </p>

            <p>
                <strong>Manager Override:</strong>
                ${data.managerOverride}
            </p>
        `;

    } catch (error) {

        result.innerHTML = `
            <p class="error">${error.message}</p>
        `;
    }
}


// ===============================
// Manager Approval
// ===============================

async function approveClaim() {

    const claimId =
        document.getElementById("approvalClaimId").value;

    const managerName =
        document.getElementById("managerName").value;

    const remarks =
        document.getElementById("remarks").value;

    const managerOverride =
        document.getElementById("managerOverride").checked;

    const result =
        document.getElementById("approvalResult");


    if (!claimId || !managerName || !remarks) {

        result.innerHTML = `
            <p class="error">
                Please fill all approval details.
            </p>
        `;

        return;
    }


    const requestData = {

        managerName: managerName,

        remarks: remarks,

        managerOverride: managerOverride
    };


    try {

        const response = await fetch(
            `${API}/claims/${claimId}/approve`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(requestData)
            }
        );

        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.message || "Approval failed"
            );
        }


        result.innerHTML = `
            <p class="success">
                Claim approved successfully!
            </p>

            <p>
                <strong>Claim ID:</strong>
                ${data.id}
            </p>

            <p>
                <strong>Status:</strong>
                ${data.status}
            </p>

            <p>
                <strong>Manager Override:</strong>
                ${data.managerOverride}
            </p>
        `;

    } catch (error) {

        result.innerHTML = `
            <p class="error">${error.message}</p>
        `;
    }
}


// ===============================
// Finance Payment
// ===============================

async function payClaim() {

    const claimId =
        document.getElementById("paymentClaimId").value;

    const paymentReference =
        document.getElementById("paymentReference").value;

    const result =
        document.getElementById("paymentResult");


    if (!claimId || !paymentReference) {

        result.innerHTML = `
            <p class="error">
                Please enter Claim ID and Payment Reference.
            </p>
        `;

        return;
    }


    const requestData = {

        paymentReference: paymentReference
    };


    try {

        const response = await fetch(
            `${API}/finance/claims/${claimId}/pay`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(requestData)
            }
        );

        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.message || "Payment failed"
            );
        }


        result.innerHTML = `
            <p class="success">
                Claim marked as PAID successfully!
            </p>

            <p>
                <strong>Claim ID:</strong>
                ${data.id}
            </p>

            <p>
                <strong>Total Amount:</strong>
                ₹${data.totalAmount}
            </p>

            <p>
                <strong>Status:</strong>
                ${data.status}
            </p>
        `;

    } catch (error) {

        result.innerHTML = `
            <p class="error">${error.message}</p>
        `;
    }
}