'use client'

import { SetStateAction, useState } from 'react';

const CSVUploadForm = () => {
  const [bankName, setBankName] = useState('');
  const [debitType, setDebitType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleBankNameChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setBankName(e.target.value);
  };

  const handleDebitTypeChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setDebitType(e.target.value);
  };

  const handleFileChange = (e: { target: { files: SetStateAction<null>[]; }; }) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!bankName || !debitType || !selectedFile) {
      alert('Please fill in all fields and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('bankName', bankName);
    formData.append('debitType', debitType);
    formData.append('csvFile', selectedFile);

    try {
      const response = await fetch('/api/upload-csv', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('CSV file uploaded successfully!');
        setBankName('');
        setDebitType('');
        setSelectedFile(null);
      } else {
        alert('Error uploading CSV file.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Bank Name:
        <input type="text" value={bankName} onChange={handleBankNameChange} />
      </label>
      <br />
      <label>
        Debit Type:
        <input type="text" value={debitType} onChange={handleDebitTypeChange} />
      </label>
      <br />
      <label>
        CSV File:
        <input type="file" accept=".csv" onChange={handleFileChange} />
      </label>
      <br />
      <button type="submit">Upload</button>
    </form>
  );
};

export default CSVUploadForm;