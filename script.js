function calculateLiability(event) {
    if (event) event.preventDefault();

    const errorBox = document.getElementById('errorBox');
    const outputSection = document.getElementById('outputSection');
    
    const mainBillInput = document.getElementById('mainBill');
    const gndMeterInput = document.getElementById('gndMeter');
    const firstMeterInput = document.getElementById('firstMeter');

    const mainBillRaw = mainBillInput.value.trim();
    const gndMeterRaw = gndMeterInput.value.trim();
    const firstMeterRaw = firstMeterInput.value.trim();

    // Field tracking and validation matching your exact error logs
    if (mainBillRaw === "") {
        showError("Please enter the Total Main Bill Amount.");
        mainBillInput.focus();
        return;
    }
    if (gndMeterRaw === "") {
        showError("Please enter the Ground Floor Submeter value.");
        gndMeterInput.focus();
        return;
    }
    if (firstMeterRaw === "") {
        showError("Please enter the First Floor Submeter value.");
        firstMeterInput.focus();
        return;
    }

    const bMain = parseFloat(mainBillRaw);
    const mGnd = parseFloat(gndMeterRaw);
    const m1st = parseFloat(firstMeterRaw);

    if (isNaN(bMain) || isNaN(mGnd) || isNaN(m1st)) {
        showError("One or more boxes contain entries that are not valid numbers.");
        return;
    }

    const mTotal = mGnd + m1st;
    const deltaB = bMain - mTotal;

    if (deltaB < 0) {
        showError(`Notice: Combined submeter readings (${mTotal.toFixed(2)}) cannot exceed the main meter bill (${bMain.toFixed(2)}). Please verify values.`);
        return;
    }

    if (mTotal === 0) {
        showError("Calculation Stopped: Submeter consumption entries cannot be zero.");
        return;
    }

    // Gracefully fade and slide the error box away if parameters match rules
    errorBox.classList.remove('visible');

    const cGnd = mGnd + ((mGnd / mTotal) * deltaB);
    const c1st = m1st + ((m1st / mTotal) * deltaB);
    const auditSum = cGnd + c1st;

    document.getElementById('resGnd').innerText = cGnd.toFixed(2);
    document.getElementById('resFirst').innerText = c1st.toFixed(2);

    document.getElementById('calcStep1').innerText = `Execution: ${bMain.toFixed(2)} - (${mGnd.toFixed(2)} + ${m1st.toFixed(2)}) = ${deltaB.toFixed(2)} [Shared Difference Found]`;
    document.getElementById('calcStep2').innerText = `Execution: ${mGnd.toFixed(2)} + ${m1st.toFixed(2)} = ${mTotal.toFixed(2)} [Total Submetered Pool]`;
    document.getElementById('calcStep3').innerText = `Execution: ${mGnd.toFixed(2)} + ((${mGnd.toFixed(2)} / ${mTotal.toFixed(2)}) * ${deltaB.toFixed(2)}) = ${mGnd.toFixed(2)} + ${((mGnd / mTotal) * deltaB).toFixed(2)} = ${cGnd.toFixed(2)}`;
    document.getElementById('calcStep4').innerText = `Execution: ${m1st.toFixed(2)} + ((${m1st.toFixed(2)} / ${mTotal.toFixed(2)}) * ${deltaB.toFixed(2)}) = ${m1st.toFixed(2)} + ${((m1st / mTotal) * deltaB).toFixed(2)} = ${c1st.toFixed(2)}`;
    document.getElementById('calcStep5').innerText = `Verification Check: ${cGnd.toFixed(2)} + ${c1st.toFixed(2)} = ${auditSum.toFixed(2)} ≡ ${bMain.toFixed(2)} (Perfect Match!)`;

    outputSection.style.display = 'block';
}

function showError(message) {
    const errorBox = document.getElementById('errorBox');
    errorBox.innerText = message;
    errorBox.classList.add('visible'); // Slid-down active animated positioning state
    document.getElementById('outputSection').style.display = 'none';
}

function toggleModal(shouldShow) {
    const modal = document.getElementById('helpModal');
    modal.style.display = shouldShow ? 'flex' : 'none';
}
