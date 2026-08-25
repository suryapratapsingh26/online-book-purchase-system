import prisma from '../lib/prisma';

const bookSelect = {
  id: true,
  title: true,
  author: true,
  description: true,
  price: true,
  coverImage: true,
  filePath: true,
} as const;

const toCatalogBook = (book: {
  id: string;
  title: string;
  author: string;
  description: string;
  price: { toString(): string };
  coverImage: string | null;
  filePath: string;
}) => ({
  ...book,
  price: Number(book.price).toFixed(2),
});

export const getBooks = async () => {
  const books = await prisma.book.findMany({
    orderBy: { title: 'asc' },
    select: bookSelect,
  });

  return books.map(toCatalogBook);
};

export const getBookById = async (id: string) => {
  const book = await prisma.book.findUnique({
    where: { id },
    select: bookSelect,
  });

  return book ? toCatalogBook(book) : null;
};
