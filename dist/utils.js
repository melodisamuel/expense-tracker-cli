// import exp from 'constants';
import Expense from './models/expenses.js';
// Fetch all expenses from the database
export async function readExpenses() {
    try {
        const expenses = await Expense.findAll();
        return expenses;
    }
    catch (error) {
        console.log('Error reading expenses from the database:', error);
        return [];
    }
}
// Add or update expenses in the database
export async function writeExpenses(expenses) {
    try {
        for (const expense of expenses) {
            await Expense.findOrCreate({
                where: { id: expense.id },
                defaults: expense,
            });
        }
        console.log('Expenses written to the database successfully.');
    }
    catch (error) {
        console.log('Failed to write to the database:', error);
    }
}
