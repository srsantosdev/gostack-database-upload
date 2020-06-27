import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // TODO
    const transactions = await this.find();

    const income = transactions.reduce((total, transaction) => {
      return transaction.type === 'income'
        ? Number(total) + Number(transaction.value)
        : Number(total);
    }, 0);
    const outcome = transactions.reduce((total, transaction) => {
      return transaction.type === 'outcome'
        ? Number(total) + Number(transaction.value)
        : Number(total);
    }, 0);
    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }
}

export default TransactionsRepository;
