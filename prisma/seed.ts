import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function seed() {
  await db.user.createMany({ data: getUsers() });

  const dbUsers = await db.user.findMany();

  await Promise.all(
    dbUsers.map(async (user: { id: string; username: string }) => {
      await db.userProfile.create({ data: { userId: user.id } });
      await db.party.create({ data: { name: `${user.username}'s Party`, creatorId: user.id } });
    })
  );
}

function getUsers() {
  return [
    {
      email: 'magick.mozzey@gmail.com',
      username: `mozzey`,
      passwordHash: '$2a$10$2Du3/L5CFr3Mu6C0z/RClubgR8DLfbcmV3siDY/oQmiPuRRPMh0eW',
    },
    {
      email: 'luxary99@gmail.com',
      username: `matt`,
      passwordHash: '$2a$10$2Du3/L5CFr3Mu6C0z/RClubgR8DLfbcmV3siDY/oQmiPuRRPMh0eW',
    },
  ];
}

seed();
