import { readExpenses, writeExpenses } from "./utils"

export interface Expense {
    id: number,
    description: string,
    amount: number,
    date: string,
    category?: string,

}

export const addExpense = (description: string, amount: number, category?: string): void => {
    const expenses = readExpenses();
    const newExpense = {
        id: expenses.length + 1,
        description,
        amount,
        date: new Date().toISOString(),
        category,
    }
    expenses.push(newExpense);
    writeExpenses(expenses);
    console.log(`Expense added succesfully (ID: ${newExpense})`);
}

export const listExpense = (): void => {
    const expenses = readExpenses();
    console.log('ID Date     Description Amount');
    expenses.forEach(expense => {
        console.log(`${expense.id} ${expense.date.slice(0, 10)} ${expense.description}  $${expense.amount}`);
    })
}

export const deleteExpense = (id: number): void => {
    const expenses = readExpenses();
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    writeExpenses(updatedExpenses);
    console.log(`Expenses deleted successfully.`);
}