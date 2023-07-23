import { NextResponse, type NextRequest } from 'next/server'
import csv from 'csv-parser';
import { Readable } from 'stream';

interface TransactionNotFormat {
  "Transaction date": string;
  Transaction: string;
  Name: string;
  Memo: string;
  Amount: string;
}

interface TransactionFormat {
  "Transaction date": string;
  Transaction: string;
  Name: string;
  Memo: string;
  Amount: string;
}

export async function POST(req: NextRequest) {  
  try {
    const data = await req.formData();
    const file: any = data.get('csvFile'); // It is an array so get the first element

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
      transactionDate: transaction["Transaction date"],
      transactionType: transaction.Transaction,
      name: transaction.Name,
      category: transaction.Memo.split('Category: ')[1],
      amount: Number(transaction.Amount)
    }))

    return NextResponse.json(formatResponse);

  } catch (error) {
    console.log('error', error)
  }
}
