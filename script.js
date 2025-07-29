// Global variables
let records = [];
let serialNumber = 1;
let fixedPrice = null;
let fixedDate = null;

// Set today's date as default
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('selectedDate').value = today;
});

// Lock date when first record is added
function lockDateIfNeeded() {
    if (records.length === 0) {
        fixedDate = document.getElementById('selectedDate').value;
    }
}

// Lock price when first entered
document.getElementById('pricePerKg').addEventListener('change', function() {
    if (fixedPrice === null && this.value) {
        fixedPrice = parseFloat(this.value);
    }
});

function calculateWage() {
    const workerName = document.getElementById('workerName').value.trim();
    const cottonPicked = parseFloat(document.getElementById('cottonPicked').value);
    const pricePerKg = parseFloat(document.getElementById('pricePerKg').value);
            
    // Validation
if (!workerName) {
        alert('Please enter worker name');
        return;
    }
            
if (!cottonPicked || cottonPicked <= 0) {
        alert('Please enter valid cotton picked in KGs');
        return;
    }
            
if (!pricePerKg || pricePerKg < 1 || pricePerKg > 300) {
        alert('Please enter price per KG between 1 and 300');
        return;
    }
            
// Lock date and price
lockDateIfNeeded();
if (fixedPrice === null) {
    fixedPrice = pricePerKg;
}
            
// Use fixed price for calculation
const totalWage = cottonPicked * fixedPrice;
            
// Display total wage
document.getElementById('totalWageAmount').textContent = totalWage.toFixed(2);
document.getElementById('totalWageDisplay').style.display = 'block';
            
// Add record to table
addRecord(workerName, cottonPicked, fixedPrice, totalWage);
            
// Clear form except date and price
document.getElementById('workerName').value = '';
document.getElementById('cottonPicked').value = '';
            
            // Set price to fixed price
document.getElementById('pricePerKg').value = fixedPrice;
document.getElementById('pricePerKg').disabled = true;
document.getElementById('selectedDate').disabled = true;
}

function addRecord(workerName, cottonPicked, pricePerKg, totalWage) {
    const record = {
        serialNumber: serialNumber++,
        date: fixedDate,
        workerName: workerName,
        cottonPicked: cottonPicked,
        pricePerKg: pricePerKg,
        totalWage: totalWage
    };
            
    records.push(record);
    updateTable();
    updateStatistics();
}

function updateTable() {
    const tbody = document.getElementById('recordsTableBody');
    tbody.innerHTML = '';
            
    records.forEach((record, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${record.serialNumber}</td>
            <td>${formatDate(record.date)}</td>
            <td>${record.workerName}</td>
            <td>${record.cottonPicked.toFixed(2)}</td>
            <td>₹${record.pricePerKg.toFixed(2)}</td>
            <td>₹${record.totalWage.toFixed(2)}</td>
            <td>
                <button class="btn-delete" onclick="deleteRecord(${index})">Delete</button>
            </td>
        `;
    });
}

function deleteRecord(index) {
    records.splice(index, 1);
            
    // Reset if all records deleted
    if (records.length === 0) {
        serialNumber = 1;
        fixedPrice = null;
        fixedDate = null;
        document.getElementById('pricePerKg').disabled = false;
        document.getElementById('selectedDate').disabled = false;
        document.getElementById('totalWageDisplay').style.display = 'none';
    }
            
    updateTable();
    updateStatistics();
}

function updateStatistics() {
    const totalWorkers = records.length;
    const totalCotton = records.reduce((sum, record) => sum + record.cottonPicked, 0);
    const totalWages = records.reduce((sum, record) => sum + record.totalWage, 0);
            
    document.getElementById('totalWorkers').textContent = totalWorkers;
    document.getElementById('totalCotton').textContent = totalCotton.toFixed(2);
    document.getElementById('totalWages').textContent = totalWages.toFixed(2)
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function saveRecords() {
    if (records.length === 0) {
        alert('No records to save');
        return;
    }
            
    const farmerName = document.getElementById('farmerName').value.trim();
    if (!farmerName) {
        alert('Please enter Farmer name');
        return;
    }
    const MestriName = document.getElementById('MestriName').value.trim();
    if (!MestriName) {
        alert('Please enter Mestri name');
        return;
    }
    const FarmerNo = document.getElementById('FarmerNo').value.trim();
    if (!FarmerNo) {
        alert('Please enter Farmer Phone Number');
        return;
    }
    const MestriNo = document.getElementById('MestriNo').value.trim();
    if (!MestriNo) {
        alert('Please enter Mestri Phone Number');
        return;
    }
            
    // In a real application, you would send this data to a server
    // For now, we'll just show a success message
alert(`Records saved successfully!\nFarmer Name : ${farmerName}\nMestri Name : ${MestriName}\nTotal Workers : ${records.length}`);
            
    // Store in localStorage for PDF generation
    localStorage.setItem('savedRecords', JSON.stringify({
        farmerName: farmerName,
        MestriName: MestriName,
        FarmerNo :FarmerNo,
        MestriNo :MestriNo,
        records: records,
        savedDate: new Date().toISOString()
    }));
}

function downloadPDF() {
    const farmerName = document.getElementById('farmerName').value.trim();
    const MestriName = document.getElementById('MestriName').value.trim();
    const FarmerNo = document.getElementById('FarmerNo').value.trim();
    const MestriNo = document.getElementById('MestriNo').value.trim();
    if (!farmerName) {
        alert('Please enter Farmer name before downloading PDF');
        return;
    }
    if (!MestriName) {
        alert('Please enter Mestri name before downloading PDF');
        return;
    }
    if (!FarmerNo) {
        alert('Please enter Farmer phone number before downloading PDF');
        return;
    }
    if (!MestriNo) {
        alert('Please enter Mestri phone number before downloading PDF');
        return;
    }  
    if (records.length === 0) {
        alert('No records to download');
        return;
    }   

   

    // Create PDF using jsPDF
const { jsPDF } = window.jspdf;
const doc = new jsPDF();

            
// Add header
doc.setFontSize(18);
doc.text('Cotton Price Report Of Workers', 105, 20, { align: 'center' });
            
doc.setFontSize(12);
doc.text(`Farmer Name : ${farmerName}`, 20, 35);
doc.text(`Farmer Phone Number : ${FarmerNo}`, 20, 42);
doc.text(`Mestri Name : ${MestriName}`, 120, 35);
doc.text(`Mestri Phone Number : ${MestriNo}`, 120, 42);
doc.text(`Date : ${formatDate(fixedDate)}`, 20, 49);
doc.text(`Total Workers : ${records.length}`, 20, 56);
            
    // Calculate totals
const totalCotton = records.reduce((sum, record) => sum + record.cottonPicked, 0);
const totalWages = records.reduce((sum, record) => sum + record.totalWage, 0);
            
doc.text(`Total Cotton : ${totalCotton.toFixed(2)} KGs`, 120, 49);
doc.text(`Total Wages : ${totalWages.toFixed(2)}`, 120, 56);
            
    // Add table
const tableData = records.map(record => [
    record.serialNumber,
    formatDate(record.date),
    record.workerName,
    record.cottonPicked.toFixed(2),
    `${record.pricePerKg.toFixed(2)}`,
    `${record.totalWage.toFixed(2)}`
]);
            
doc.autoTable({
    head: [['S.No', 'Date', 'Worker Name', 'Cotton in (KGs)', 'Price/KG', 'Total Wage']],
    body: tableData,
    startY: 60,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [65, 105, 225] }
});
            
    // Add footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.text('Generated on: ' + new Date().toLocaleString(), 20, pageHeight - 10);
            
         // Save the PDF
    doc.save(`Cotton_Price_Report_${farmerName}_${formatDate(fixedDate)}.pdf`);
}

    // Enter key functionality
document.getElementById('workerName').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('cottonPicked').focus();
    }
});
        
document.getElementById('cottonPicked').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('pricePerKg').focus();
    }
});
        
document.getElementById('pricePerKg').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculateWage();
    }
});
