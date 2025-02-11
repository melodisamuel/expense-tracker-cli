#!/usr/bin/env node

import { sequelize } from "./database.js";
import Expense from "./models/expenses.js";
import "reflect-metadata";
import { Command } from "commander";
import Table from 'cli-table3';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const program = new Command();

// Initialize database connections and sync models
(async () => {
  try {
    await sequelize.sync(); // Don't use { force: true } in production
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
})();

const addExpense = async (
  description: string,
  amount: number,
  category?: string
): Promise<void> => {
  try {
    console.log('Attempting to add expense to the database...');
    const newExpense = await Expense.create({
      description,
      amount,
      date: new Date().toISOString(),
      category,
    });
    console.log(`Expense added successfully (ID: ${newExpense.id})`);
  } catch (error) {
    console.error('Error adding expense:', error);
  }
};

let currentPage = 1;
const pageSize = 5;

const listExpense = async (page: number = 1): Promise<void> => {
  try {
    const expenses = await Expense.findAll({
      limit: pageSize,
      offset: (page - 1) * pageSize
    });

    if (expenses.length === 0) {
      console.log('No expenses found.');
      return;
    }

    // Define table structure
    const table = new Table({
      head: ['ID', 'Date', 'Description', 'Category', 'Amount'],
      colWidths: [5, 15, 20, 20, 20], // Adjust column widths as needed
    });

    // Populate table with expenses
    expenses.forEach((expense) => {
      const formattedDate = expense.get('date')
        ? new Date(expense.get('date')).toISOString().slice(0, 10)
        : 'No date';

      table.push([
        expense.get('id'),
        formattedDate,
        expense.get('description'),
        expense.get('category'),
        `$${expense.get('amount')}`,
      ]);
    });

    console.log(table.toString()); // Display table
    // Prompt user to load more if there are more expenses to fetch
    console.log('\nType "load"  to load more expense');
  } catch (error) {
    console.error('Error listing expenses:', error);
  }
};

// Initialise loading of pages
await listExpense(currentPage);

// Function to handle interactive CLI input
const handleInput = () => {
  rl.question('\nType "load" to load more expenses or "exit" to quit: ', async (command) => {
    if (command.toLowerCase() === 'load') {
      currentPage++;
      await listExpense(currentPage);
      handleInput();
    } else if (command.toLocaleLowerCase() === 'exit') {
      console.log('Exiting the application...');
      rl.close();
    } else {
      console.log('Unknown command. Type "load" to load more or "exit" to quit');
      handleInput();
    }
  });
};

const deleteExpense = async (id: number): Promise<void> => {
  try {
    const result = await Expense.destroy({ where: { id } });
    if (result) {
      console.log(`Expense with ID ${id} deleted successfully.`);
    } else {
      console.log(`Expense with ID ${id} not found.`);
    }
  } catch (error) {
    console.error('Error deleting expense:', error);
  }
};

const updateExpense = async (id: number, updates: Partial<{ description: string; amount: number; category: string; date: string }>): Promise<void> => {
  try {
    const [updated] = await Expense.update(updates, { where: { id } });

    if (updated) {
      console.log(`Expense with ID: ${id} updated successfully.`);
    } else {
      console.log(`Expense with ID: ${id} not found.`);
    }
  } catch (error) {
    console.error("Error updating expense:", error);
  }
};

const summary = async (month?: number): Promise<void> => {
  try {
    const expenses = month
      ? await Expense.findAll({ where: sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), month) })
      : await Expense.findAll();

    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    console.log(`Total expenses${month ? ` for month ${month}` : ""}: $${total}`);
  } catch (error) {
    console.log('Error generating summary:', error);
  }
};

// Main command handler
const args = process.argv.slice(2);
const command = args[0];

const main = async () => {
  switch (command) {
    case "add":
      const description = args[1];
      const amount = parseFloat(args[2]);
      const category = args[3];

      if (!description || isNaN(amount)) {
        console.error("Usage: add <description> <amount> [category]");
      } else {
        await addExpense(description, amount, category);
      }
      break;

    case "list":
      await listExpense(currentPage);
      break;

    case "delete":
      const idToDelete = parseInt(args[1], 10);

      if (isNaN(idToDelete)) {
        console.error("Usage: delete <id>");
      } else {
        await deleteExpense(idToDelete);
      }
      break;

    case "update":
      const idToUpdate = parseInt(args[1], 10);
      const updates: Record<string, any> = {};

      // Loop through the rest of the arguments in pairs
      for (let i = 2; i < args.length; i += 2) {
        const key = args[i]; // Field name (e.g., "description")
        const value = args[i + 1]; // Field value (e.g., "Cars")

        if (key && value !== undefined) {
          // Convert amount to number if updating it
          updates[key] = key === "amount" ? parseFloat(value) : value;
        }
      }

      if (isNaN(idToUpdate) || Object.keys(updates).length === 0) {
        console.error("Usage: update <id> <field> <value> [<field> <value>...]");
      } else {
        await updateExpense(idToUpdate, updates);
      }
      break;

    case "summary":
      const month = args[1] ? parseInt(args[1], 10) : undefined;

      if (month && (month < 1 || month > 12)) {
        console.error("Usage: summary [month]");
      } else {
        await summary(month);
      }
      break;

    default:
      console.error("Unknown command");
      console.error("Available commands: add, list, delete, update, summary");
      break;
  }
};

// Run the interactive CLI
handleInput();
