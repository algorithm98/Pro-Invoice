import React from 'react';
import { Plus, Trash2, Building2, User, FileText, Settings2 } from 'lucide-react';
import type { Invoice, Item } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  invoice: Invoice;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
}

export const InvoiceForm: React.FC<Props> = ({ invoice, setInvoice }) => {
  const addItem = () => {
    const newItem: Item = {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      price: 0,
      tax: 0,
    };
    setInvoice({ ...invoice, items: [...invoice.items, newItem] });
  };

  const updateItem = (id: string, field: keyof Item, value: string | number) => {
    const newItems = invoice.items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setInvoice({ ...invoice, items: newItems });
  };

  const removeItem = (id: string) => {
    setInvoice({ ...invoice, items: invoice.items.filter((item) => item.id !== id) });
  };

  const handleBusinessChange = (field: keyof Invoice['business'], value: string) => {
    setInvoice({
      ...invoice,
      business: { ...invoice.business, [field]: value },
    });
  };

  const handleClientChange = (field: keyof Invoice['client'], value: string) => {
    setInvoice({
      ...invoice,
      client: { ...invoice.client, [field]: value },
    });
  };

  return (
    <div className="invoice-form">
      <motion.div className="form-section" layout>
        <div className="section-header">
          <Building2 size={20} />
          <h3>Business Details</h3>
        </div>
        <div className="grid-2">
          <input
            placeholder="e.g., Acme Corporation"
            value={invoice.business.name}
            onChange={(e) => handleBusinessChange('name', e.target.value)}
          />
          <input
            placeholder="e.g., billing@acme.com"
            value={invoice.business.email}
            onChange={(e) => handleBusinessChange('email', e.target.value)}
          />
          <input
            placeholder="e.g., +1 (555) 123-4567"
            value={invoice.business.phone}
            onChange={(e) => handleBusinessChange('phone', e.target.value)}
          />
          <input
            placeholder="e.g., https://acme.com"
            value={invoice.business.website}
            onChange={(e) => handleBusinessChange('website', e.target.value)}
          />
          <textarea
            placeholder="e.g., 123 Business Avenue, Suite 100, City, State, ZIP"
            className="span-2"
            value={invoice.business.address}
            onChange={(e) => handleBusinessChange('address', e.target.value)}
          />
        </div>
      </motion.div>

      <motion.div className="form-section" layout>
        <div className="section-header">
          <User size={20} />
          <h3>Client Details</h3>
        </div>
        <div className="grid-2">
          <input
            placeholder="e.g., Global Tech Inc."
            value={invoice.client.name}
            onChange={(e) => handleClientChange('name', e.target.value)}
          />
          <input
            placeholder="e.g., accounts@globaltech.com"
            value={invoice.client.email}
            onChange={(e) => handleClientChange('email', e.target.value)}
          />
          <input
            placeholder="e.g., +44 20 7123 4567"
            value={invoice.client.phone}
            onChange={(e) => handleClientChange('phone', e.target.value)}
          />
          <textarea
            placeholder="e.g., 456 Tech Park, London, UK"
            className="span-2"
            value={invoice.client.address}
            onChange={(e) => handleClientChange('address', e.target.value)}
          />
        </div>
      </motion.div>

      <motion.div className="form-section" layout>
        <div className="section-header">
          <FileText size={20} />
          <h3>Invoice Info</h3>
        </div>
        <div className="grid-3">
          <input
            placeholder="e.g., INV-2026-001"
            value={invoice.invoiceNumber}
            onChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })}
          />
          <input
            type="date"
            value={invoice.date}
            onChange={(e) => setInvoice({ ...invoice, date: e.target.value })}
          />
          <input
            type="date"
            value={invoice.dueDate}
            onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
          />
        </div>
      </motion.div>

      <motion.div className="form-section" layout>
        <div className="section-header">
          <Settings2 size={20} />
          <h3>Items</h3>
        </div>
        <div className="items-list">
          <AnimatePresence initial={false}>
            {invoice.items.map((item) => (
              <motion.div 
                key={item.id} 
                className="item-row"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                layout
              >
                <input
                  placeholder="e.g., Website Redesign"
                  className="item-desc"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Qty"
                  className="item-qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="Price"
                  className="item-price"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="Tax %"
                  className="item-tax"
                  value={item.tax}
                  onChange={(e) => updateItem(item.id, 'tax', Number(e.target.value))}
                />
                <motion.button 
                  className="btn-icon btn-danger" 
                  onClick={() => removeItem(item.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 size={18} />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
          <motion.button 
            className="btn-secondary btn-full" 
            onClick={addItem}
            whileHover={{ backgroundColor: 'var(--secondary)' }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={18} /> Add Item
          </motion.button>
        </div>
      </motion.div>

      <motion.div className="form-section" layout>
        <textarea
          placeholder="e.g., Thank you for your business. Please make checks payable to Acme Corporation."
          value={invoice.notes}
          onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
        />
        <textarea
          placeholder="e.g., Payment is due within 15 days. Late payments are subject to a 2% fee."
          value={invoice.terms}
          onChange={(e) => setInvoice({ ...invoice, terms: e.target.value })}
        />
      </motion.div>

      <style>{`
        .invoice-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .form-section {
          background: var(--white);
          padding: 20px;
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border);
        }
        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          color: var(--primary);
        }
        .section-header h3 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-main);
        }
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }
        .span-2 {
          grid-column: span 2;
        }
        .items-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .item-row {
          display: grid;
          grid-template-columns: 2fr 0.5fr 1fr 0.5fr auto;
          gap: 10px;
          align-items: center;
          overflow: hidden;
        }
        .btn-icon {
          padding: 8px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-danger {
          background: #fee2e2;
          color: #ef4444;
        }
        .btn-danger:hover {
          background: #fecaca;
        }
        .btn-secondary {
          background: var(--bg-subtle);
          color: var(--text-main);
          border: 1px dashed var(--primary);
          padding: 12px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 500;
        }
        .btn-full {
          width: 100%;
        }
        textarea {
          min-height: 80px;
          resize: vertical;
        }
        @media (max-width: 640px) {
          .grid-2, .grid-3 {
            grid-template-columns: 1fr;
          }
          .span-2 {
            grid-column: span 1;
          }
          .item-row {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }
          .item-desc {
            grid-column: span 2;
          }
          .btn-danger {
            grid-column: span 2;
          }
        }
      `}</style>
    </div>
  );
};
