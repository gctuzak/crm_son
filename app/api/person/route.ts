import { NextResponse } from 'next/server';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

const personSchema = z.object({
  tcKimlikNo: z.string().length(11),
  ePosta: z.string().email(),
  telefon: z.string().min(10),
  sehir: z.string().min(2),
  adres: z.string().min(5),
  calistigiSirket: z.string().min(1, 'Şirket adı boş olamaz'),
  pozisyon: z.string().min(1, 'Pozisyon boş olamaz'),
  islemYapi: z.string().optional()
});

const DB_PATH = path.join(process.cwd(), 'data', 'persons.json');

async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeDB(data: any) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Veri doğrulama
    const validatedData = personSchema.parse(body);
    
    // Mevcut verileri oku
    const persons = await readDB();
    
    // E-posta kontrolü
    if (persons.some((p: any) => p.ePosta === validatedData.ePosta)) {
      return NextResponse.json(
        { message: 'Bu e-posta adresi zaten kullanımda' },
        { status: 409 }
      );
    }

    // Yeni kişiyi ekle
    const newPerson = {
      id: Date.now().toString(),
      ...validatedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    persons.push(newPerson);
    await writeDB(persons);
    
    return NextResponse.json(
      { message: 'Başarılı', data: newPerson },
      { status: 200 }
    );
  } catch (error) {
    console.error('Hata:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Doğrulama hatası', errors: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Sunucu hatası', error: (error as Error).message },
      { status: 500 }
    );
  }
} 