import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import qrcode from 'qrcode';

export async function POST(request) {
  const person = await request.json();
  console.log(person);
  const filePath = path.join(process.cwd(), 'public', 'persons.json');
  let persons = [];

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    persons = JSON.parse(data);
  }

  persons.push(person);

  fs.writeFileSync(filePath, JSON.stringify(persons, null, 2), 'utf8');

  const fileName = `${person.firstName.toLowerCase().replace(/ /g, '-')}.png`;
  const qrCodePath = path.join(process.cwd(), 'public', fileName);

  const qrCodeData = await qrcode.toDataURL(JSON.stringify(person));

  await qrcode.toFile(qrCodePath, JSON.stringify(person));

  return NextResponse.json({ message: 'Person registered and QR code generated', qrCodeData });
}
