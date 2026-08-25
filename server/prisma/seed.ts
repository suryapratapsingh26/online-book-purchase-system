import prisma from '../src/lib/prisma';

const catalogBooks = [
  {
    id: '00000000-0000-4000-8000-000000000001',
    title: 'The Clockwork Library',
    author: 'Mira Voss',
    description:
      'A young archivist discovers a hidden reading room where every book predicts a different future.',
    price: '249.00',
    coverImage: '/uploads/covers/book-01.jpg',
    filePath: '/uploads/books/book-01.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    title: 'Monsoon Letters',
    author: 'Arun Dev',
    description:
      'An epistolary novel about two childhood friends reconnecting across cities during a season of heavy rain.',
    price: '199.00',
    coverImage: '/uploads/covers/book-02.jpg',
    filePath: '/uploads/books/book-02.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000003',
    title: 'Rails Beneath the Moon',
    author: 'Leena Hart',
    description:
      'A night train journey becomes a quiet mystery when passengers begin sharing impossible memories.',
    price: '279.00',
    coverImage: '/uploads/covers/book-03.jpg',
    filePath: '/uploads/books/book-03.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000004',
    title: 'Saltwater Algorithms',
    author: 'Nikhil Rao',
    description:
      'A coastal engineer uses data, folklore, and courage to protect a town from a changing sea.',
    price: '349.00',
    coverImage: '/uploads/covers/book-04.jpg',
    filePath: '/uploads/books/book-04.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000005',
    title: 'The Paper Observatory',
    author: 'Elena Cross',
    description:
      'A gentle science adventure about students building a handmade observatory on their school roof.',
    price: '229.00',
    coverImage: '/uploads/covers/book-05.jpg',
    filePath: '/uploads/books/book-05.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000006',
    title: 'Cities of Quiet Fire',
    author: 'Kabir Menon',
    description:
      'Linked stories follow ordinary people whose small choices reshape a rapidly growing city.',
    price: '299.00',
    coverImage: '/uploads/covers/book-06.jpg',
    filePath: '/uploads/books/book-06.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000007',
    title: 'Beginner Stone Gardens',
    author: 'Isha Bloom',
    description:
      'A practical guide to designing calming indoor stone gardens for compact apartments and desks.',
    price: '159.00',
    coverImage: '/uploads/covers/book-07.jpg',
    filePath: '/uploads/books/book-07.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000008',
    title: 'The Last Lantern Maker',
    author: 'Sofia Vale',
    description:
      'A craftswoman tries to save her family workshop while teaching a restless apprentice the value of patience.',
    price: '239.00',
    coverImage: '/uploads/covers/book-08.jpg',
    filePath: '/uploads/books/book-08.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000009',
    title: 'Practical TypeScript Patterns',
    author: 'Dev Malhotra',
    description:
      'A hands-on programming book with clear patterns for writing safer and more maintainable TypeScript.',
    price: '499.00',
    coverImage: '/uploads/covers/book-09.jpg',
    filePath: '/uploads/books/book-09.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000010',
    title: 'Blue Orchard Summer',
    author: 'Nora Quinn',
    description:
      'A warm family drama about inheritance, forgiveness, and reviving a neglected orchard.',
    price: '219.00',
    coverImage: '/uploads/covers/book-10.jpg',
    filePath: '/uploads/books/book-10.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000011',
    title: 'Data Trails for Beginners',
    author: 'Rohan Sethi',
    description:
      'An approachable introduction to collecting, cleaning, and understanding data for everyday decisions.',
    price: '399.00',
    coverImage: '/uploads/covers/book-11.jpg',
    filePath: '/uploads/books/book-11.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000012',
    title: 'The Glass Compass',
    author: 'Amelia North',
    description:
      'A fantasy quest follows a mapmaker whose compass points toward the truth people most want to avoid.',
    price: '289.00',
    coverImage: '/uploads/covers/book-12.jpg',
    filePath: '/uploads/books/book-12.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000013',
    title: 'Small Cafe Economics',
    author: 'Meera Shah',
    description:
      'A friendly business primer explaining pricing, inventory, and customer flow through a neighborhood cafe.',
    price: '329.00',
    coverImage: '/uploads/covers/book-13.jpg',
    filePath: '/uploads/books/book-13.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000014',
    title: 'Echoes in the Courtyard',
    author: 'Tara Jain',
    description:
      'A literary mystery set around an old courtyard house where every resident knows part of the secret.',
    price: '269.00',
    coverImage: '/uploads/covers/book-14.jpg',
    filePath: '/uploads/books/book-14.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000015',
    title: 'Modern CSS Field Notes',
    author: 'Julian Reed',
    description:
      'A compact guide to layout, responsive interfaces, and practical styling systems for web developers.',
    price: '459.00',
    coverImage: '/uploads/covers/book-15.jpg',
    filePath: '/uploads/books/book-15.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000016',
    title: 'River Map Recipes',
    author: 'Anaya Cooke',
    description:
      'A collection of regional recipes connected by river towns, markets, and seasonal ingredients.',
    price: '379.00',
    coverImage: '/uploads/covers/book-16.jpg',
    filePath: '/uploads/books/book-16.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000017',
    title: 'The Engineer and the Banyan',
    author: 'Vikram Hall',
    description:
      'A reflective novel about a bridge designer who returns home to solve a problem no blueprint can capture.',
    price: '259.00',
    coverImage: '/uploads/covers/book-17.jpg',
    filePath: '/uploads/books/book-17.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000018',
    title: 'Quiet Habits, Clear Mind',
    author: 'Lina Brooks',
    description:
      'A practical self-improvement guide focused on small daily systems for attention, rest, and consistency.',
    price: '189.00',
    coverImage: '/uploads/covers/book-18.jpg',
    filePath: '/uploads/books/book-18.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000019',
    title: 'Mystery at Dock Seven',
    author: 'Owen Pierce',
    description:
      'A fast-paced detective story about a missing cargo ledger and the people trying to hide it.',
    price: '249.00',
    coverImage: '/uploads/covers/book-19.jpg',
    filePath: '/uploads/books/book-19.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000020',
    title: 'Foundations of Clean APIs',
    author: 'Sara Patel',
    description:
      'A backend development guide covering routing, validation, errors, and service boundaries in plain language.',
    price: '449.00',
    coverImage: '/uploads/covers/book-20.jpg',
    filePath: '/uploads/books/book-20.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000021',
    title: 'The Museum of Second Chances',
    author: 'Clara Finch',
    description:
      'A museum curator catalogues donated objects and uncovers stories of regret, repair, and renewal.',
    price: '309.00',
    coverImage: '/uploads/covers/book-21.jpg',
    filePath: '/uploads/books/book-21.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000022',
    title: 'Introductory PostgreSQL Projects',
    author: 'Manav Kulkarni',
    description:
      'A project-based database book teaching schemas, relationships, queries, indexes, and migrations.',
    price: '429.00',
    coverImage: '/uploads/covers/book-22.jpg',
    filePath: '/uploads/books/book-22.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000023',
    title: 'Wind Over Copper Hills',
    author: 'Priya Stone',
    description:
      'An adventure novel about explorers crossing copper hills to deliver a message before winter arrives.',
    price: '279.00',
    coverImage: '/uploads/covers/book-23.jpg',
    filePath: '/uploads/books/book-23.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000024',
    title: 'Designing Study Systems',
    author: 'Farah Lane',
    description:
      'A student-friendly handbook for planning study sessions, tracking progress, and preparing for exams.',
    price: '199.00',
    coverImage: '/uploads/covers/book-24.jpg',
    filePath: '/uploads/books/book-24.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000025',
    title: 'The Rainproof Notebook',
    author: 'Elliot Marsh',
    description:
      'A cozy mystery about a journalist whose waterproof notebook contains clues to an old town scandal.',
    price: '259.00',
    coverImage: '/uploads/covers/book-25.jpg',
    filePath: '/uploads/books/book-25.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000026',
    title: 'Everyday Finance Made Simple',
    author: 'Neha Varma',
    description:
      'A clear personal finance guide covering budgeting, saving, debt, and long-term planning basics.',
    price: '299.00',
    coverImage: '/uploads/covers/book-26.jpg',
    filePath: '/uploads/books/book-26.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000027',
    title: 'Letters from Mars Colony',
    author: 'Jon Bell',
    description:
      'A hopeful science fiction story told through dispatches from the first classroom on Mars.',
    price: '339.00',
    coverImage: '/uploads/covers/book-27.jpg',
    filePath: '/uploads/books/book-27.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000028',
    title: 'Mindful Product Management',
    author: 'Rhea Lawson',
    description:
      'A concise product guide about discovery, prioritization, roadmaps, and thoughtful team communication.',
    price: '389.00',
    coverImage: '/uploads/covers/book-28.jpg',
    filePath: '/uploads/books/book-28.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000029',
    title: 'The Hidden Spice Route',
    author: 'Samir Coast',
    description:
      'A historical adventure following merchants, cooks, and sailors along a fictional spice route.',
    price: '319.00',
    coverImage: '/uploads/covers/book-29.jpg',
    filePath: '/uploads/books/book-29.pdf',
  },
  {
    id: '00000000-0000-4000-8000-000000000030',
    title: 'Debugging the Morning',
    author: 'Kavya Ellis',
    description:
      'A light workplace comedy about a junior developer learning code, confidence, and collaboration.',
    price: '229.00',
    coverImage: '/uploads/covers/book-30.jpg',
    filePath: '/uploads/books/book-30.pdf',
  },
];

const seed = async () => {
  const seedIds = catalogBooks.map((book) => book.id);

  await prisma.$transaction([
    prisma.book.deleteMany({
      where: {
        id: {
          notIn: seedIds,
        },
      },
    }),
    ...catalogBooks.map((book) =>
      prisma.book.upsert({
        where: { id: book.id },
        update: {
          title: book.title,
          author: book.author,
          description: book.description,
          price: book.price,
          coverImage: book.coverImage,
          filePath: book.filePath,
        },
        create: book,
      })
    ),
  ]);

  const bookCount = await prisma.book.count();
  console.log(`Seeded ${bookCount} books.`);
};

seed()
  .catch((error: unknown) => {
    console.error('Book seed failed.');
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
