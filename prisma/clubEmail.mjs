import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { PrismaClient } from "@prisma/client";
import fs from 'fs';
const saltRounds = 10;

const prisma = new PrismaClient();

async function main() {
  const clubs = await prisma.club.findMany();
  let csvData = 'Club Name, Password\n'; // Initialize CSV string

  for (const club of clubs) {
    // Remove spaces, convert to lowercase, and limit length to 8 characters
    let clubName = club.name.replace(/\s/g, '').toLowerCase();
    clubName = clubName.substring(0, 8);

    // Generate 4 random characters
    const randomChars = crypto.randomBytes(2).toString('hex');

    // Combine club name and random characters
    const password = `${clubName}${randomChars}`;

    // Add club name and password to CSV string
    csvData += `${club.name}, ${password}\n`;

    // Hash the password before storing it in your database
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await prisma.club.update({
      where: {id: club.id}, 
      data: {password: hashedPassword},
    });
  }

  // Write CSV string to file
  fs.writeFile('passwords.csv', csvData, (err) => {
    if (err) {
      console.error(err);
    }
    else {
      console.log('CSV file created successfully.');
    }
  });
}

main()
.catch((e) => console.error(e))
.finally(async () => {
  await prisma.$disconnect();
});
