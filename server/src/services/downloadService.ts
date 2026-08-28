import { access } from 'node:fs/promises';
import path from 'node:path';
import { OrderStatus, PaymentStatus } from '../generated/prisma/client';
import prisma from '../lib/prisma';

const downloadRoot = path.resolve(process.cwd(), 'uploads');

export const getAuthorizedDownloadPath = async (userId: string, bookId: string) => {
  const purchase = await prisma.order.findFirst({
    where: {
      userId,
      bookId,
      status: OrderStatus.PAID,
      payment: { is: { status: PaymentStatus.VERIFIED } },
    },
    select: { book: { select: { filePath: true } } },
  });

  if (!purchase) {
    return null;
  }

  const relativePath = purchase.book.filePath.replace(/^[/\\]+/, '');
  const filePath = path.resolve(downloadRoot, relativePath);

  if (filePath !== downloadRoot && !filePath.startsWith(`${downloadRoot}${path.sep}`)) {
    return null;
  }

  try {
    await access(filePath);
  } catch {
    return undefined;
  }

  return filePath;
};