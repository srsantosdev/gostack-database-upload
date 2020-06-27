import path from 'path';
import fs from 'fs';
import csvParse from 'csv-parse';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

import uploadConfig from '../config/upload';

interface Request {
  filename: string;
}

interface TransactionCSV {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute({ filename }: Request): Promise<Transaction[]> {
    // TODO
    const createTransaction = new CreateTransactionService();
    const csvPath = path.join(uploadConfig.directory, filename);

    const readCSVStream = fs.createReadStream(csvPath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const transactions: Transaction[] = [];
    const transactionsCSV: TransactionCSV[] = [];

    parseCSV.on('data', line => {
      const [title, type, value, category] = line;

      const transaction = {
        title,
        type,
        value,
        category,
      } as TransactionCSV;

      transactionsCSV.push(transaction);
    });

    await new Promise(resolve => {
      parseCSV.on('end', async () => {
        await fs.promises.unlink(csvPath);
        resolve();
      });
    });

    for (const { title, type, category, value } of transactionsCSV) {
      const transaction = await createTransaction.execute({
        title,
        type,
        category,
        value,
      });

      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
