import * as SQLite from 'expo-sqlite';
import dayjs from 'dayjs';

export const db = SQLite.openDatabaseSync('moneyTracker.db');

// Database එක සකස් කිරීම
export const initDatabase = () => {
  try {
    db.execSync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL,
        type TEXT,
        category TEXT,
        date TEXT,
        note TEXT
      );
      CREATE TABLE IF NOT EXISTS monthly_summary (
        month_key TEXT PRIMARY KEY,
        total_income REAL,
        total_expense REAL,
        opening_balance REAL,
        closing_balance REAL
      );
    `);
    processMonthEnd(); // ඇප් එක ඔපන් වෙද්දී පරණ මාසය සේව් වෙන්න
  } catch (error) {
    console.error("DB Error: ", error);
  }
};

// අලුත් ගනුදෙනුවක් ඇතුලත් කිරීම
export const addTransaction = (amount: number, type: string, category: string, date: string, note: string) => {
  db.runSync(
    'INSERT INTO transactions (amount, type, category, date, note) VALUES (?, ?, ?, ?, ?)',
    [amount, type, category, date, note]
  );
};

// සියලුම ගනුදෙනු ලබා ගැනීම (අලුත්ම ඒවා උඩට)
export const getAllTransactions = () => {
  return db.getAllSync('SELECT * FROM transactions ORDER BY date DESC, id DESC');
};

// මාසය ඉවර වෙද්දී සාරාංශය සේව් කිරීම (Carry Forward Logic)
export const processMonthEnd = () => {
  const lastMonth = dayjs().subtract(1, 'month').format('YYYY-MM');
  
  // දැනටමත් සේව් වෙලාද බලන්න
  const existing = db.getFirstSync('SELECT * FROM monthly_summary WHERE month_key = ?', [lastMonth]);
  if (existing) return;

  // පසුගිය මාසයේ ආදායම සහ වියදම
  const income: any = db.getFirstSync("SELECT SUM(amount) as total FROM transactions WHERE type='income' AND date LIKE ?", [`${lastMonth}%`]);
  const expense: any = db.getFirstSync("SELECT SUM(amount) as total FROM transactions WHERE type='expense' AND date LIKE ?", [`${lastMonth}%`]);

  // ඊට කලින් මාසයේ ඉතිරිය (Opening Balance)
  const prevMonth = dayjs(lastMonth).subtract(1, 'month').format('YYYY-MM');
  const prevSummary: any = db.getFirstSync('SELECT closing_balance FROM monthly_summary WHERE month_key = ?', [prevMonth]);
  
  const openingBalance = prevSummary ? prevSummary.closing_balance : 0;
  const totalIncome = income?.total || 0;
  const totalExpense = expense?.total || 0;
  const closingBalance = openingBalance + totalIncome - totalExpense;

  // Save කිරීම
  db.runSync(
    'INSERT INTO monthly_summary (month_key, total_income, total_expense, opening_balance, closing_balance) VALUES (?, ?, ?, ?, ?)',
    [lastMonth, totalIncome, totalExpense, openingBalance, closingBalance]
  );
};

// සියලුම මාසික සාරාංශ ලබා ගැනීම (History සඳහා)
export const getMonthlySummaries = () => {
  return db.getAllSync('SELECT * FROM monthly_summary ORDER BY month_key DESC');
};