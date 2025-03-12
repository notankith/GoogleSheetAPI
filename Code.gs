function doGet(e) {
  const sheetName = e.parameter.sheetName;
  const action = e.parameter.action || "payments";

  const ss = SpreadsheetApp.openById("1unqm3O5gp1RsGYy8DYk5UFdt0eaIQsx-3xmVeeNtc64");
  if (action === "payments") {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return errorResponse("Sheet not found");
    
    const data = sheet.getDataRange().getValues();
    const result = data.slice(1).map(row => ({
      invoice: row[0],
      store: row[1],
      amount: row[2],
      received: row[3],
      mode: row[4] || ""
    }));
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } else if (action === "report") {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return errorResponse("Sheet not found");
    
    const data = sheet.getDataRange().getValues().slice(1);
    let cash = 0, cheque = 0, upi = 0;
    data.forEach(row => {
      const received = parseFloat(row[3]) || 0;
      const mode = row[4] || "";
      if (mode === "Cash") cash += received;
      else if (mode === "Cheque") cheque += received;
      else if (mode === "UPI") upi += received;
    });
    return ContentService.createTextOutput(JSON.stringify({ cash, cheque, upi }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  const sheetName = e.parameter.sheetName;
  const action = e.parameter.action || "updatePayment";
  const ss = SpreadsheetApp.openById("1unqm3O5gp1RsGYy8DYk5UFdt0eaIQsx-3xmVeeNtc64");

  if (action === "updatePayment") {
    const invoice = e.parameter.invoice;
    const received = parseFloat(e.parameter.received);
    const mode = e.parameter.mode;
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return errorResponse("Sheet not found");

    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === invoice) {
        sheet.getRange(i + 1, 4).setValue(received);
        sheet.getRange(i + 1, 5).setValue(mode);
        return ContentService.createTextOutput("Update successful")
          .setMimeType(ContentService.MimeType.TEXT);
      }
    }
    return errorResponse("Invoice not found");
  } else if (action === "addExpense") {
    const fuelAmount = parseFloat(e.parameter.fuelAmount);
    const kilometers = parseFloat(e.parameter.kilometers);
    const expenseSheet = ss.getSheetByName("Expenses");
    const date = new Date().toLocaleDateString();
    expenseSheet.appendRow([sheetName, date, fuelAmount, kilometers]);
    return ContentService.createTextOutput("Expense logged")
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

function errorResponse(message) {
  return ContentService.createTextOutput(message)
    .setMimeType(ContentService.MimeType.TEXT);
}
