import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function seed() {
  // sqlite doesn't support .createMany()
  getUsers().map(async user => {
    const dbUser = await db.user.create({ data: user });

    await db.userProfile.create({ data: { userId: dbUser.id } });
    await db.party.create({ data: { name: `${dbUser.username}'s Party`, creatorId: dbUser.id } });
  });
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
