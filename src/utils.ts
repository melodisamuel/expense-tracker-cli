import fs from 'fs';
import path from 'path';

const filePath = path.resolve(__dirname, 'expenses.json');

import { Expense } from './expenses';

const DATA_FILE = './expenses.json';

 export function readExpenses(): Expense[] {

    try{
        if(!fs.existsSync('expenses.json')) {
            fs.writeFileSync('expenses.json', JSON.stringify([]));
            return [];
        }
        const data = fs.readFileSync('expenses.json', 'utf-8');
        return data.trim() ? JSON.parse(data) : [];
    } catch (error) {
        console.log('Error reading expenses', error);
        return [];
    }
  
}

 export function writeExpenses(expenses: Expense[]): void {
    try{
        fs.writeFileSync('expenses.json', JSON.stringify(expenses, null, 2));
    } catch (error) {
        console.log('Failed to write to the expenses fiel:', error);
    }
}

