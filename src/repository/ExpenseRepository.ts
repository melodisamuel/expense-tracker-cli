import Expense from "../expenses";

export const createExpense = async (description: string, amount: number, category: string): Promise<Expense> => {
    return await Expense.create({ description, amount, category});
};

export const getExpense = async (): Promise<Expense[]> => {
    return await Expense.findAll();
};

export const getExpenseById = async (id: number): Promise<Expense | null> => {
    return await Expense.findByPk(id);
};

export const deleteExpense = async (id: number): Promise<number> => {
    return await Expense.destroy({ where: { id }})
}