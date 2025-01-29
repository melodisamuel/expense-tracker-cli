#!/usr/bin/env node
import sequelize from "./database.js";
import Expense from "./models/expenses.js";
import "reflect-metadata";
// Initialise database connecttions and sync models
(async () => {
    try {
        await sequelize.sync({ force: true });
        console.log("Database synchronized succesfully.");
    }
    catch (error) {
        console.error("Error synchronizing database:", error);
    }
})();
import { Command } from "commander";
// import { Expense } from './expenses'
const program = new Command();
import { readExpenses } from "./utils.js";
const addExpense = async (description, amount, category) => {
    try {
        const newExpense = await Expense.create({
            description,
            amount,
            date: new Date().toISOString(),
            category,
        });
        console.log(`Expense added succesfully (ID: ${newExpense.id})`);
    }
    catch (error) {
        console.error('Error adding expense');
    }
};
const listExpense = async () => {
    try {
        const expenses = await readExpenses();
        console.log('ID Date     Description   Amount');
        expenses.forEach((expense) => {
            const formatedDate = expense.date.toISOString().slice(0, 10);
            console.log(`${formatedDate} ${expense.description} $${expense.amount}`);
        });
    }
    catch (error) {
        console.error('Error listening expenses');
    }
};
const deleteExpense = async (id) => {
    try {
        const result = await Expense.destroy({ where: { id } });
        if (result) {
            console.log(`Expense with ID ${id} deleted succesfully.`);
        }
        else {
            console.log(`Expense with ID ${id} not found`);
        }
    }
    catch (error) {
        console.error('Error deleting expense', error);
    }
};
const updateExpense = async (id, description, amount) => {
    try {
        const expense = await Expense.findByPk(id);
        if (expense) {
            expense.description = description;
            expense.amount = amount;
            await expense.save();
            console.log(`Expense with ID: ${id} updated successfully.`);
        }
        else {
            console.log(`Expense with ID: ${id} not found.`);
        }
    }
    catch (error) {
        console.error('Error updating expense:', error);
    }
};
const summary = async (month) => {
    try {
        const expenses = await readExpenses();
        const filterdExpenses = month
            ? expenses.filter((expense) => new Date(expense.date).getMonth() + 1 === month)
            : expenses;
        const total = filterdExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        console.log(`Total expenses${month ? ` for month ${month}` : ""}: `);
    }
    catch (error) {
        console.log('Error generating summary:', error);
    }
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
            await addExpense(description, amount, category);
        }
        break;
    case "list":
        await listExpense();
        break;
    case "delete":
        const idToDelete = parseInt(args[1], 10);
        if (isNaN(idToDelete)) {
            console.error("Usage: delete <id>");
        }
        else {
            await deleteExpense(idToDelete);
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
            await updateExpense(idToUpdate, newDescription, newAmount);
        }
        break;
    case "summary":
        const month = args[1] ? parseInt(args[1], 10) : undefined;
        if (month && (month < 1 || month > 12)) {
            console.error("Usage: summary [month]");
        }
        else {
            await summary(month);
        }
        break;
    default:
        console.error("Unkown command");
        console.error("Available commands: add, list, delete, update, summary");
        break;
}
