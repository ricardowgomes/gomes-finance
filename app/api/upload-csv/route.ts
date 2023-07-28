import { NextResponse, type NextRequest } from 'next/server'
import csv from 'csv-parser';
import { Readable } from 'stream';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface TransactionNotFormat {
  "Transaction date": string;
  Transaction: string;
  Name: string;
  Memo: string;
  Amount: string;
}

interface TransactionFormat {
  date: string;
  type: string;
  origin: string;
  name: string;
  category: string;
  amount: number;
}

export async function POST(req: NextRequest) {  
  try {
    const data = await req.formData();
    const file: any = data.get('csvFile');
    const origin: FormDataEntryValue | null = data.get('origin');

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Convert Buffer to Readable Stream
    const readableStream = new Readable({
      read() {
        this.push(fileBuffer);
        this.push(null);
      }
    });

    let results: any = [];
    await new Promise((resolve, reject) => {
      readableStream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    const formatResponse: [TransactionFormat] = results.map(
      (transaction: TransactionNotFormat) => ({
        date: new Date(transaction["Transaction date"]),
        type: transaction.Transaction,
        name: transaction.Name,
        category: transaction.Memo || 'Other',
        origin: origin,
        amount: Number(transaction.Amount)
    }))

    const createdTransactions = await prisma.transaction.createMany({
      data: formatResponse,
    })
  
    await prisma.$disconnect()

    return NextResponse.json(createdTransactions);

  } catch (error) {
    console.log('error', error)
  }
}
