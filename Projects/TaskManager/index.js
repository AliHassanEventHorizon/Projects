var count = 1;
document.getElementById("enterButton").onclick = function myenter() {
    var table = document.getElementById("table");
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var text = document.getElementById("textBox1");
    var text2 = document.getElementById("textBox2");
    var text3 = document.getElementById("textBox3");
    var text4 = document.getElementById("textBox4");
    cell1.innerHTML = text === null || text === void 0 ? void 0 : text.value;
    cell2.innerHTML = text2 === null || text2 === void 0 ? void 0 : text2.value;
    cell3.innerHTML = text3 === null || text3 === void 0 ? void 0 : text3.value;
    cell4.innerHTML = text4 === null || text4 === void 0 ? void 0 : text4.value;
    count ++;
};
document.getElementById("removeButton").onclick = function mydeleteRow() {
    var table = document.getElementById("table");
 
    if (count > 1){
    table.deleteRow(1);
    }
    count--;
    if (count < 1) {
        count = 1 
    }
};
document.getElementById("Last").onclick = function mydeleteRow() {
    if (count > 1) {
    var table = document.getElementById("table");
   count--;
        table.deleteRow(count); 
    }
    if (count < 1) {
        count = 1 
    }
};
function updateTime() {
    var currenttime = new Date;
    var hours = currenttime.getHours();
    var minutes = currenttime.getMinutes();
    var t;
    var f = "0";
    if (hours > 12) {
        t = "PM";
    }
    else {
        t = "AM";
    }
   switch(hours){

  
    case 13:
    hours = 1
    break 
    case 14:
    hours = 2
    break
    case 13:
    hours = 1
    break 
    case 14:
    hours = 2
    break 
    case 15:
    hours = 3
    break 
    case 16:
    hours = 4
    break 
    case 17:
    hours = 5
    break 
    case 18:
    hours = 6
    break 
    case 19:
    hours = 7
    break 
    case 20:
    hours = 8
    break 
    case 21:
    hours = 9
    break 
    case 22:
    hours = 10
    break 
    case 23:
    hours = 11
    break 
    case 0:
    hours = 12
    break 
    }
 
    if (minutes < 10) 
    {
        var timeString = hours + ":" + f + minutes + t;

    }
    else
    {
        var timeString = hours + ":" + minutes + t;

    }
   
    var label = document.getElementById("currentTime");
    label.textContent = timeString;
    setInterval(updateTime, 10000);
}
updateTime();
function currentdate() {
    var currenttime = new Date;
    var day = currenttime.getUTCDate();
    var year = currenttime.getUTCFullYear();
    var month = currenttime.getMonth();
    month++;
    var date = year + ":" + month + ":" + day;
    var label = document.getElementById("currentDate");
    label.textContent = date;
}
currentdate();
setInterval(currentdate, 60000);
function loadPage(pageUrl) {
    var contentContainer = document.getElementById('content');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', pageUrl, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            contentContainer.innerHTML = xhr.responseText;
        }
    };
    xhr.send();
}
document.getElementById('clearButton').onclick = function() {
    localStorage.clear();
    location.reload();
};
document.getElementById("Save").onclick = function(){
    const table = document.getElementById('table');
    const tableData = [];

    // Collect header data
    const headerRow = table.rows[0];
    const headerData = [];
    for (const headerCell of headerRow.cells) {
        headerData.push(headerCell.innerText);
    }
    tableData.push(headerData);

    // Collect row data
    for (let i = 1; i < table.rows.length; i++) {
        const rowDataInRow = [];
        const row = table.rows[i];
        for (let j = 0; j < row.cells.length; j++) {
            rowDataInRow.push(row.cells[j].innerText);
        }
        tableData.push(rowDataInRow);
    }

    const collectionName = prompt("Enter a name for the collection:");

    if (collectionName) {
       
        fetch("http://localhost:8289/Save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ collectionName, tableData }),
        })
      .then(response => response.json())
      .then(data => {
        if (data.message == "Task has been saved") {
          alert(data.message);
         
         } 
         if (data.message == "Save overwritten") {
          alert("Save overwritten");
         }
    
        
      })
    }

}
document.getElementById("Load").onclick = function () {
    const collectionName = prompt("Enter the name of the save");
    fetch("http://localhost:8289/Load", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ collectionName }),
        })
      .then(response => response.json())
      .then (data =>{
        const tableData = data.tabledata;


        if (tableData) {
            const parsedData = tableData
            const table = document.getElementById('table');
            table.innerHTML = ''; 
    
           
            for (const rowData of parsedData) {
                const row = table.insertRow();
                for (const cellData of rowData) {
                    const cell = row.insertCell();
                    cell.innerText = cellData;
                }
            }
        }
      })
}
function saveTableData() {
    const table = document.getElementById('table');
    const tableData = [];

    // Collect header data
    const headerRow = table.rows[0];
    const headerData = [];
    for (const headerCell of headerRow.cells) {
        headerData.push(headerCell.innerText);
    }
    tableData.push(headerData);

    // Collect row data
    for (let i = 1; i < table.rows.length; i++) {
        const rowDataInRow = [];
        const row = table.rows[i];
        for (let j = 0; j < row.cells.length; j++) {
            rowDataInRow.push(row.cells[j].innerText);
        }
        tableData.push(rowDataInRow);
    }

    // Clear existing data in local storage
    localStorage.removeItem('tableData');

    // Save the new data
    localStorage.setItem('tableData', JSON.stringify(tableData));

    // Update the count variable
    count = table.rows.length;
}



function loadTableDataFromLocalStorage() {
    const tableData = localStorage.getItem('tableData');

    if (tableData) {
        const parsedData = JSON.parse(tableData);
        const table = document.getElementById('table');
        table.innerHTML = ''; // Clear the table

        // Create table rows and cells based on the loaded data
        for (const rowData of parsedData) {
            const row = table.insertRow();
            for (const cellData of rowData) {
                const cell = row.insertCell();
                cell.innerText = cellData;
            }
        }
    }
}

window.addEventListener('load', loadTableDataFromLocalStorage);


// Save the table data every second
setInterval(saveTableData, 1000);