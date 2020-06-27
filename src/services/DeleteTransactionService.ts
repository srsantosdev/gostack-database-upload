import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  transaction_id: string;
}

class DeleteTransactionService {
  public async execute({ transaction_id }: Request): Promise<void> {
    // TODO
    const transactionRepository = getCustomRepository(TransactionRepository);

    const transaction = await transactionRepository.findOne({
      where: { id: transaction_id },
    });

    if (!transaction) {
      throw new AppError('Transaction not found.', 404);
    }

    await transactionRepository.delete({ id: transaction.id });
  }
}

export default DeleteTransactionService;
