import React from 'react';
import { FileText, Clock, Trash2, ChevronRight } from 'lucide-react';
import type { Invoice } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  invoices: Invoice[];
  onSelect: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
  activeId?: string;
}

export const SavedInvoices: React.FC<Props> = ({ invoices, onSelect, onDelete, activeId }) => {
  return (
    <div className="saved-invoices">
      <div className="sidebar-header">
        <Clock size={20} />
        <h2>Recent Invoices</h2>
      </div>
      <div className="invoices-list">
        <AnimatePresence initial={false}>
          {invoices.length === 0 ? (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p>No saved invoices yet.</p>
            </motion.div>
          ) : (
            invoices.map((inv) => (
              <motion.div 
                key={inv.id} 
                className={`invoice-card ${activeId === inv.id ? 'active' : ''}`}
                onClick={() => onSelect(inv)}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                whileHover={{ x: 4 }}
                layout
              >
                <div className="card-icon">
                  <FileText size={18} />
                </div>
                <div className="card-info">
                  <h4>{inv.client.name || 'Untitled Client'}</h4>
                  <p>#{inv.invoiceNumber} • {inv.date}</p>
                </div>
                <motion.button 
                  className="delete-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(inv.id);
                  }}
                  whileHover={{ scale: 1.2 }}
                >
                  <Trash2 size={16} />
                </motion.button>
                <ChevronRight size={16} className="arrow" />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .saved-invoices {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--primary);
          padding: 0 10px;
        }
        .sidebar-header h2 {
          font-size: 1rem;
          color: var(--text-main);
          font-weight: 700;
        }
        .invoices-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .invoice-card {
          background: white;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: border-color 0.2s ease;
          position: relative;
        }
        .invoice-card:hover {
          border-color: var(--primary);
        }
        .invoice-card.active {
          border-color: var(--primary);
          background: var(--secondary);
        }
        .card-icon {
          width: 36px;
          height: 36px;
          background: var(--secondary);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }
        .card-info h4 {
          font-size: 0.875rem;
          margin-bottom: 2px;
          color: var(--text-main);
          font-weight: 600;
        }
        .card-info p {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .delete-btn {
          margin-left: auto;
          background: none;
          color: var(--text-muted);
          padding: 6px;
          border-radius: 6px;
          opacity: 0;
        }
        .invoice-card:hover .delete-btn {
          opacity: 1;
        }
        .delete-btn:hover {
          color: #ef4444;
          background: #fee2e2;
        }
        .arrow {
          color: var(--border);
        }
        .empty-state {
          padding: 40px 10px;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.875rem;
          border: 1px dashed var(--border);
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
};
