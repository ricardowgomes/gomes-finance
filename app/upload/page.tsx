'use client'

import { SetStateAction, useState } from 'react';

interface Transaction {
  transactionDate: string;
  transactionType: string;
  name: string;
  category: string;
  amount: string;
}

const CSVUploadForm = () => {
  const [origin, setOrigin] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [transactions, setTransactions] = useState<[Transaction] | null>(null)

  const handleOriginChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setOrigin(e.target.value);
  };

  const handleFileChange = (e: any) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!origin || !selectedFile) {
      alert('Please fill in all fields and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('origin', origin);
    formData.append('csvFile', selectedFile);

    try {
      const response = await fetch('/api/upload-csv', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('CSV file uploaded successfully!');
        setOrigin('');
        setSelectedFile(null);

        response.json().then((result) => {
          setTransactions(result)
        })
      } else {
        alert('Error uploading CSV file.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <main>

    <form onSubmit={handleSubmit}>
      <label>
        Origem:
        <input type="text" value={origin} onChange={handleOriginChange} />
      </label>
      <br />
      <label>
        CSV File:
        <input type="file" accept=".csv" onChange={handleFileChange} />
      </label>
      <br />
      <button type="submit">Upload</button>
    </form>
      {transactions && (
        <table>
          <thead>
            <tr>
              <th>transactionDate</th>
                  <th>name</th>
                  <th>transactionType</th>
                  <th>category</th>
                  <th>amount</th>
            </tr>
        </thead>
          <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.name}>
                  <td>{transaction.transactionDate}</td>
                  <td>{transaction.name}</td>
                  <td>{transaction.transactionType}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.amount}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </main>
  );
};

export default CSVUploadForm;