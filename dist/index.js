#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const program = new commander_1.Command();
const utils_1 = require("./utils");
const addExpense = (description, amount, category) => {
    const expenses = (0, utils_1.readExpenses)();
    const newExpense = {
        id: expenses.length + 1,
        description,
        amount,
        date: new Date().toISOString(),
        category,
    };
    expenses.push(newExpense);
    (0, utils_1.writeExpenses)(expenses);
    console.log(`Expense added succesfully (ID: ${newExpense})`);
};
const listExpense = () => {
    const expenses = (0, utils_1.readExpenses)();
    console.log("ID Date     Description Amount");
    expenses.forEach((expense) => {
        console.log(`${expense.id} ${expense.date.slice(0, 10)} ${expense.description}  $${expense.amount}`);
    });
};
const deleteExpense = (id) => {
    const expenses = (0, utils_1.readExpenses)();
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    (0, utils_1.writeExpenses)(updatedExpenses);
    console.log(`Expenses deleted successfully.`);
};
const updateExpense = (id, description, amount) => {
    const expenses = (0, utils_1.readExpenses)();
    const expense = expenses.find((expense) => expense.id === id);
    if (expense) {
        expense.description = description;
        expense.amount = amount;
        (0, utils_1.writeExpenses)(expenses);
        console.log(`Expense with ID ${id} updated successfully.`);
    }
    else {
        console.log(`Expense with ID ${id} not found.`);
    }
};
const summary = (month) => {
    const expenses = (0, utils_1.readExpenses)();
    const filterdExpenses = month
        ? expenses.filter((expense) => new Date(expense.date).getMonth() + 1 === month)
        : expenses;
    const total = filterdExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    console.log(`Total expenses${month ? ` for month ${month}` : ""}: `);
};
const args = process.argv.slice(2);
const command = args[0];
switch (command) {
    case "add":
        const description = args[1];
        const amount = parseFloat(args[2]);
        const category = args[3];
        if (!description || isNaN(amount)) {
            console.error("Usage: add <description> <amount> [category]");
        }
        else {
            addExpense(description, amount, category);
        }
        break;
    case "list":
        listExpense();
        break;
    case "delete":
        const idToDelete = parseInt(args[1], 10);
        if (isNaN(idToDelete)) {
            console.error("Usage: delete <id>");
        }
        else {
            deleteExpense(idToDelete);
        }
        break;
    case "update":
        const idToUpdate = parseInt(args[1], 10);
        const newDescription = args[2];
        const newAmount = parseFloat(args[3]);
        if (isNaN(idToUpdate) || !newDescription || isNaN(newAmount)) {
            console.error("Usage: update <id> <newDescription> <newAmount>");
        }
        else {
            updateExpense(idToUpdate, newDescription, newAmount);
        }
        break;
    case "summary":
        const month = args[1] ? parseInt(args[1], 10) : undefined;
        if (month && (month < 1 || month > 12)) {
            console.error("Usage: summary [month]");
        }
        else {
            summary(month);
        }
        break;
    default:
        console.error("Unkown command");
        console.error("Available commands: add, list, delete, update, summary");
        break;
}
