function evaluateExpression(expression, inputValues) {
    // Avalia uma expressão booleana.
    let stack = [];
    for (let token of expression) {
        if (token === '¬') {
            let operand = stack.pop();
            stack.push(!operand);
        } else if (['∧', '∨', '⊻', '^', 'v', '-v', '->', '<-->'].includes(token)) {
            let operand2 = stack.pop();
            let operand1 = stack.pop();
            if (token === '∧' || token === '^') {
                stack.push(operand1 && operand2);
            } else if (token === '∨' || token === 'v') {
                stack.push(operand1 || operand2);
            } else if (token === '⊻' || token === '-v') {
                stack.push((operand1 || operand2) && !(operand1 && operand2));
            } else if (token === '->') {
                stack.push(!operand1 || operand2);
            } else if (token === '<-->') {
                stack.push(operand1 === operand2);
            }
        } else if (token.match(/[a-zA-Z]/)) { // Verifica se é uma variável
            stack.push(inputValues[token]);
        }
    }
    return stack[0];
}

function truthTable(expression) {
    // Gera uma tabela verdade para uma expressão.
    let variables = [...new Set(expression.match(/[a-zA-Z]/g))];
    variables.sort();
    let header = [...variables, expression];
    let rows = generateRows(variables.length);
    let table = rows.map(row => {
        let inputValues = Object.fromEntries(variables.map((variable, index) => [variable, row[index]]));
        return [...row, evaluateExpression(expression, inputValues)];
    });
    return [header, table];
}

function generateRows(length) {
    // Gera todas as combinações possíveis de valores booleanos para um número dado de variáveis.
    let rows = [];
    for (let i = 0; i < Math.pow(2, length); i++) {
        let row = [];
        for (let j = 0; j < length; j++) {
            row.push(Boolean((i >> (length - 1 - j)) & 1));
        }
        rows.push(row);
    }
    return rows;
}

function printTruthTable(header, table) {
    // Imprime a tabela verdade.
    let truthTablesDiv = document.getElementById('truthTables');
    truthTablesDiv.innerHTML = '';

    let tableElement = document.createElement('table');
    let headerRow = document.createElement('tr');

    header.forEach(column => {
        let th = document.createElement('th');
        th.textContent = column;
        headerRow.appendChild(th);
    });

    tableElement.appendChild(headerRow);

    table.forEach(rowData => {
        let row = document.createElement('tr');
        rowData.forEach(cellData => {
            let cell = document.createElement('td');
            cell.textContent = cellData;
            row.appendChild(cell);
        });
        tableElement.appendChild(row);
    });

    truthTablesDiv.appendChild(tableElement);
}

function checkEquivalence() {
    let expression1 = document.getElementById('expression1').value;
    let expression2 = document.getElementById('expression2').value;

    if (!expression1 || !expression2) {
        alert("Por favor, insira ambas as expressões.");
        return;
    }

    if (equivalent(expression1, expression2)) {
        document.getElementById('equivalenceResult').textContent = "As expressões são equivalentes.";
    } else {
        document.getElementById('equivalenceResult').textContent = "As expressões não são equivalentes.";
    }
}

function generateTruthTables() {
    let expression1 = document.getElementById('expression1').value;
    let expression2 = document.getElementById('expression2').value;

    if (!expression1 || !expression2) {
        alert("Por favor, insira ambas as expressões.");
        return;
    }

    let [header1, table1] = truthTable(expression1);
    let [header2, table2] = truthTable(expression2);

    printTruthTable(header1, table1);
    printTruthTable(header2, table2);
}

function equivalent(expression1, expression2) {
    // Verifica se duas expressões são equivalentes.
    let [header1, table1] = truthTable(expression1);
    let [header2, table2] = truthTable(expression2);

    if (header1.join() !== header2.join()) {
        return false;
    }

    for (let i = 0; i < table1.length; i++) {
        if (table1[i][table1[i].length - 1] !== table2[i][table2[i].length - 1]) {
            return false;
        }
    }

    return true;
}

