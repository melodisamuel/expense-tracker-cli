#!/usr/bin/env node
import { sequelize } from "./database.js";
import Expense from "./models/expenses.js";
import "reflect-metadata";
import { Command } from "commander";
const program = new Command();
// Initialize database connections and sync models
(async () => {
    try {
        await sequelize.sync(); // Don't use { force: true } in production
        console.log("Database synchronized successfully.");
    }
    catch (error) {
        console.error("Error synchronizing database:", error);
    }
})();
const addExpense = async (description, amount, category) => {
    try {
        console.log('Attempting to add expense to the database...');
        const newExpense = await Expense.create({
            description,
            amount,
            date: new Date().toISOString(),
            category,
        });
        console.log(`Expense added successfully (ID: ${newExpense.id})`);
    }
    catch (error) {
        console.error('Error adding expense:', error);
    }
};
const listExpense = async () => {
    try {
        const expenses = await Expense.findAll(); // Fetch from the database
        console.log('ID  Date       Description   Amount');
        expenses.forEach((expense) => {
            const formattedDate = expense.date.toISOString().slice(0, 10);
            console.log(`${expense.id} ${formattedDate} ${expense.description} $${expense.amount}`);
        });
    }
    catch (error) {
        console.error('Error listing expenses:', error);
    }
};
const deleteExpense = async (id) => {
    try {
        const result = await Expense.destroy({ where: { id } });
        if (result) {
            console.log(`Expense with ID ${id} deleted successfully.`);
        }
        else {
            console.log(`Expense with ID ${id} not found.`);
        }
    }
    catch (error) {
        console.error('Error deleting expense:', error);
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
        const expenses = month
            ? await Expense.findAll({ where: sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), month) })
            : await Expense.findAll();
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        console.log(`Total expenses${month ? ` for month ${month}` : ""}: $${total}`);
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
            // Ensure this always sends the expense to the database
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
        console.error("Unknown command");
        console.error("Available commands: add, list, delete, update, summary");
        break;
}
