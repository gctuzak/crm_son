import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import path from 'path';

const prisma = new PrismaClient();

async function importExcelData(filePath: string, tableName: string) {
    try {
        // Excel dosyasını oku
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Excel verilerini JSON'a dönüştür
        const data = XLSX.utils.sheet_to_json(worksheet);

        console.log(`${data.length} kayıt bulundu.`);

        // Verileri veritabanına aktar
        for (const row of data) {
            // Tarih alanlarını düzelt
            Object.keys(row).forEach(key => {
                if (key.toLowerCase().includes('date') || key.toLowerCase().includes('at')) {
                    if (row[key]) {
                        const date = new Date(row[key]);
                        if (!isNaN(date.getTime())) {
                            row[key] = date;
                        }
                    }
                }
            });

            try {
                // @ts-ignore
                await prisma[tableName].create({
                    data: row
                });
                console.log(`Kayıt eklendi:`, row);
            } catch (error) {
                console.error(`Kayıt eklenirken hata oluştu:`, error);
                console.error(`Hatalı veri:`, row);
            }
        }

        console.log(`Veri aktarımı tamamlandı. ${data.length} kayıt işlendi.`);
    } catch (error) {
        console.error('Veri aktarımı sırasında hata oluştu:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Komut satırı argümanlarını al
const args = process.argv.slice(2);
if (args.length !== 2) {
    console.log('Kullanım: ts-node importExcel.ts <excel_dosyası> <tablo_adı>');
    process.exit(1);
}

const [excelFile, tableName] = args;
const filePath = path.resolve(excelFile);

// Script'i çalıştır
importExcelData(filePath, tableName)
    .catch(error => {
        console.error('Script çalıştırılırken hata oluştu:', error);
        process.exit(1);
    }); 