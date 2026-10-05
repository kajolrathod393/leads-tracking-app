import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.note.deleteMany();
  await prisma.lead.deleteMany();

  const leads = [
    {
      name: "John Doe",
      email: "john@example.com",
      phone: "9876543210",
      status: "new",
      notes: ["First contact made via website form."],
    },
    {
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "9876543211",
      status: "contacted",
      notes: ["Called on Monday, follow up next week."],
    },
    {
      name: "Priya Patel",
      email: "priya@example.com",
      phone: "9876543212",
      status: "qualified",
      notes: ["Budget confirmed.", "Ready for a product demo."],
    },
    {
      name: "Amit Kumar",
      email: "amit@example.com",
      phone: "9876543213",
      status: "lost",
      notes: ["Went with a competitor."],
    },
    {
      name: "Sara Khan",
      email: "sara@example.com",
      phone: "9876543214",
      status: "new",
      notes: [],
    },
  ];

  for (const leadData of leads) {
    const { notes, ...leadFields } = leadData;
    await prisma.lead.create({
      data: {
        ...leadFields,
        notes: {
          create: notes.map((content) => ({ content })),
        },
      },
    });
  }

  console.log(`Seeded ${leads.length} leads.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
