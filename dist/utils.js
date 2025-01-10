"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readExpenses = readExpenses;
exports.writeExpenses = writeExpenses;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const filePath = path_1.default.resolve(__dirname, 'expenses.json');
const DATA_FILE = './expenses.json';
function readExpenses() {
    try {
        if (!fs_1.default.existsSync('expenses.json')) {
            fs_1.default.writeFileSync('expenses.json', JSON.stringify([]));
            return [];
        }
        const data = fs_1.default.readFileSync('expenses.json', 'utf-8');
        return data.trim() ? JSON.parse(data) : [];
    }
    catch (error) {
        console.log('Error reading expenses', error);
        return [];
    }
}
function writeExpenses(expenses) {
    try {
        fs_1.default.writeFileSync('expenses.json', JSON.stringify(expenses, null, 2));
    }
    catch (error) {
        console.log('Failed to write to the expenses fiel:', error);
    }
}
