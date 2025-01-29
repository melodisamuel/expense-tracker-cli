import Expense from "../models/expenses.js";
export const createExpense = async (description, amount, category) => {
    return await Expense.create({ description, amount, category });
};
export const getExpense = async () => {
    return await Expense.findAll();
};
export const getExpenseById = async (id) => {
    return await Expense.findByPk(id);
};
export const deleteExpense = async (id) => {
    return await Expense.destroy({ where: { id } });
};
