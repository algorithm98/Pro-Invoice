import React from 'react';
import { Save, Download, Printer, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onSave: () => void;
  onDownload: () => void;
  onPrint: () => void;
}

export const InvoiceActions: React.FC<Props> = ({ onSave, onDownload, onPrint }) => {
  return (
    <div className="invoice-actions glass-card">
      <motion.button 
        className="btn-primary" 
        onClick={onSave}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Save size={18} /> <span className="hide-tablet">Save</span>
      </motion.button>
      <motion.button 
        className="btn-outline" 
        onClick={onDownload}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Download size={18} /> <span className="hide-tablet">PDF</span>
      </motion.button>
      <motion.button 
        className="btn-outline" 
        onClick={onPrint}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Printer size={18} /> <span className="hide-tablet">Print</span>
      </motion.button>
      <motion.button 
        className="btn-outline"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Share2 size={18} /> <span className="hide-tablet">Share</span>
      </motion.button>

      <style>{`
        .invoice-actions {
          padding: 12px;
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          z-index: 100;
          overflow-x: auto;
        }
        .btn-primary {
          background: var(--primary);
          color: #ffffff;
          padding: 10px 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
        }
        .btn-outline {
          background: var(--bg-main);
          color: var(--text-main);
          border: 1px solid var(--border);
          padding: 10px 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
        }
        .btn-outline:hover {
          background: var(--secondary);
          border-color: var(--primary);
          color: var(--primary);
        }
        @media (max-width: 640px) {
          .hide-tablet {
            display: none;
          }
          .btn-primary, .btn-outline {
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
};
