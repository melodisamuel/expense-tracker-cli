#!/usr/bin/env node

import sequelize from "./database";
import Expense from "./expenses";

// Initialise database connecttions and sync models 
(async () => {
  try{
    await sequelize.sync({ force: true });
    console.log("Database synchronized succesfully.");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
})();


import { Command } from "commander"
// import { Expense } from './expenses'


const program = new Command();
import { readExpenses, writeExpenses } from './utils'


 const addExpense = (
  description: string,
  amount: number,
  category?: string
): void => {
  const expenses = readExpenses();
  const newExpense = {
    id: expenses.length + 1,
    description,
    amount,
    date: new Date().toISOString(),
    category,
  };
  expenses.push(newExpense);
  writeExpenses(expenses);
  console.log(`Expense added succesfully (ID: ${newExpense})`);
};

 const listExpense = (): void => {
  const expenses = readExpenses();
  console.log("ID Date     Description Amount");
  expenses.forEach((expense) => {
    console.log(
      `${expense.id} ${expense.date.slice(0, 10)} ${expense.description}  $${
        expense.amount
      }`
    );
  });
};

 const deleteExpense = (id: number): void => {
  const expenses = readExpenses();
  const updatedExpenses = expenses.filter((expense) => expense.id !== id);
  writeExpenses(updatedExpenses);
  console.log(`Expenses deleted successfully.`);
};

 const updateExpense = (
  id: number,
  description: string,
  amount: number
): void => {
  const expenses = readExpenses();
  const expense = expenses.find((expense) => expense.id === id);
  if (expense) {
    expense.description = description;
    expense.amount = amount;
    writeExpenses(expenses);
    console.log(`Expense with ID ${id} updated successfully.`);
  } else {
    console.log(`Expense with ID ${id} not found.`);
  }
};

 const summary = (month?: number): void => {
  const expenses = readExpenses();
  const filterdExpenses = month
    ? expenses.filter(
        (expense) => new Date(expense.date).getMonth() + 1 === month
      )
    : expenses;

  const total = filterdExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
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
    } else {
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
    } else {
      deleteExpense(idToDelete);
    }
    break;

  case "update":
    const idToUpdate = parseInt(args[1], 10);
    const newDescription = args[2];
    const newAmount = parseFloat(args[3]);
    if (isNaN(idToUpdate) || !newDescription || isNaN(newAmount)) {
      console.error("Usage: update <id> <newDescription> <newAmount>");
    } else {
      updateExpense(idToUpdate, newDescription, newAmount);
    }
    break;

  case "summary":
    const month = args[1] ? parseInt(args[1], 10) : undefined;

    if (month && (month < 1 || month > 12)) {
      console.error("Usage: summary [month]");
    } else {
      summary(month);
    }
    break;

  default:
    console.error("Unkown command");
    console.error("Available commands: add, list, delete, update, summary");

    break
}
