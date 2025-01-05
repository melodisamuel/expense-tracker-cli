import fs from 'fs';

import { Expense } from './expenses';

const DATA_FILE = './expenses.json';

export const readExpenses = (): Expense[] => {
    if(!fs.existsSync(DATA_FILE)) {
        return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
}

export const writeExpenses = (expenses: Expense[]): void => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(expenses, null, 2));
}

