import React from 'react';
import type { Invoice } from '../types';
import logo from '../assets/logo.png';

interface Props {
  invoice: Invoice;
}

export const InvoicePreview: React.FC<Props> = ({ invoice }) => {
  const calculateSubtotal = () => {
    return invoice.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  };

  const calculateTax = () => {
    return invoice.items.reduce((acc, item) => acc + (item.quantity * item.price * (item.tax / 100)), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: invoice.currency || 'INR',
    }).format(amount);
  };

  return (
    <div id="invoice-preview" className="invoice-preview glass-card">
      <div className="invoice-header">
        <div className="brand">
          <div className="logo-container">
            <img src={invoice.business.logo || logo} alt="Logo" className="logo" />
          </div>
          <div className="business-info">
            <h2>{invoice.business.name || 'Your Business Name'}</h2>
            <p>{invoice.business.email}</p>
            <p>{invoice.business.phone}</p>
          </div>
        </div>
        <div className="invoice-meta">
          <h1>INVOICE</h1>
          <p>#{invoice.invoiceNumber || '0001'}</p>
          <div className="meta-grid">
            <span>Date:</span>
            <span>{invoice.date}</span>
            <span>Due Date:</span>
            <span>{invoice.dueDate}</span>
          </div>
        </div>
      </div>

      <div className="billing-info">
        <div className="bill-to">
          <h4>Bill To:</h4>
          <h3>{invoice.client.name || 'Client Name'}</h3>
          <p>{invoice.client.address}</p>
          <p>{invoice.client.email}</p>
        </div>
      </div>

      <div className="table-container">
        <table className="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th className="text-right">Qty</th>
              <th className="text-right">Price</th>
              <th className="text-right">Tax</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td>{item.description || 'New Item'}</td>
                <td className="text-right">{item.quantity}</td>
                <td className="text-right">{formatCurrency(item.price)}</td>
                <td className="text-right">{item.tax}%</td>
                <td className="text-right">
                  {formatCurrency(item.quantity * item.price * (1 + item.tax / 100))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="invoice-footer">
        <div className="notes-section">
          {invoice.notes && (
            <div className="note-box">
              <h4>Notes:</h4>
              <p>{invoice.notes}</p>
            </div>
          )}
          {invoice.terms && (
            <div className="note-box">
              <h4>Terms:</h4>
              <p>{invoice.terms}</p>
            </div>
          )}
        </div>
        <div className="totals-section">
          <div className="total-row">
            <span>Subtotal:</span>
            <span>{formatCurrency(calculateSubtotal())}</span>
          </div>
          <div className="total-row">
            <span>Tax:</span>
            <span>{formatCurrency(calculateTax())}</span>
          </div>
          <div className="total-row grand-total">
            <span>Total:</span>
            <span>{formatCurrency(calculateTotal())}</span>
          </div>
        </div>
      </div>

      <style>{`
        .invoice-preview {
          padding: 40px;
          min-height: 842px;
          width: 100%;
          background: white;
          color: #1e293b;
          display: flex;
          flex-direction: column;
          gap: 32px;
          position: sticky;
          top: 20px;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .brand {
          display: flex;
          gap: 16px;
          align-items: center;
        }
        .logo-container {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .business-info h2 {
          font-size: 1.1rem;
          margin-bottom: 2px;
          font-weight: 700;
        }
        .business-info p {
          color: var(--text-muted);
          font-size: 0.75rem;
        }
        .invoice-meta {
          text-align: right;
        }
        .invoice-meta h1 {
          font-size: 2rem;
          color: var(--primary);
          letter-spacing: -1px;
          line-height: 1;
          margin-bottom: 4px;
          font-weight: 800;
        }
        .meta-grid {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 4px 12px;
          margin-top: 12px;
          font-size: 0.75rem;
        }
        .billing-info {
          border-top: 1px solid var(--border);
          padding-top: 20px;
        }
        .bill-to h4 {
          font-size: 0.7rem;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 6px;
          letter-spacing: 0.05em;
        }
        .bill-to h3 {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .bill-to p {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .table-container {
          overflow-x: auto;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 500px;
        }
        .items-table th {
          text-align: left;
          padding: 10px 8px;
          border-bottom: 2px solid var(--primary);
          color: var(--primary);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
        }
        .items-table td {
          padding: 12px 8px;
          border-bottom: 1px solid var(--border);
          font-size: 0.875rem;
        }
        .text-right { text-align: right !important; }
        .invoice-footer {
          display: grid;
          grid-template-columns: 1fr 220px;
          gap: 32px;
          margin-top: auto;
        }
        .note-box {
          margin-bottom: 12px;
        }
        .note-box h4 {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 4px;
          font-weight: 700;
        }
        .note-box p {
          font-size: 0.8rem;
          white-space: pre-wrap;
          color: var(--text-muted);
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          font-size: 0.875rem;
        }
        .grand-total {
          border-top: 2px solid var(--primary);
          margin-top: 6px;
          padding-top: 12px;
          font-weight: 800;
          font-size: 1.1rem;
          color: var(--primary);
        }
        @media print {
          .invoice-preview {
            position: static;
            padding: 0;
            box-shadow: none;
            border: none;
          }
        }
        @media (max-width: 640px) {
          .invoice-footer {
            grid-template-columns: 1fr;
          }
          .invoice-preview {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};
