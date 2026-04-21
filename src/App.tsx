import { useState, useEffect } from 'react';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import { InvoiceActions } from './components/InvoiceActions';
import { SavedInvoices } from './components/SavedInvoices';
import { AuthScreen as Auth } from './components/AuthScreen';
import type { Invoice } from './types';
import { Plus, Menu, X, Share2, LogOut, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from './assets/logo.png';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  setDoc, 
  doc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 11);
};

const INITIAL_INVOICE: Invoice = {
  id: generateId(),
  invoiceNumber: 'INV-001',
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  business: {
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
  },
  client: {
    name: '',
    email: '',
    phone: '',
    address: '',
  },
  items: [
    { id: generateId(), description: 'Consulting Services', quantity: 1, price: 500, tax: 10 }
  ],
  notes: '',
  terms: 'Payment is due within 7 days. Thank you for your business!',
  currency: 'INR',
  status: 'draft',
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<Invoice>(INITIAL_INVOICE);
  const [savedInvoices, setSavedInvoices] = useState<Invoice[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        setInvoice({ ...INITIAL_INVOICE, id: generateId() });
      }
    });
    return () => unsubscribe();
  }, []);

  // Firestore Sync
  useEffect(() => {
    if (!user) {
      setSavedInvoices([]);
      return;
    }

    const q = query(
      collection(db, 'invoices'), 
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const invoices = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Invoice));
      setSavedInvoices(invoices);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    try {
      const invoiceData = {
        ...invoice,
        userId: user.uid,
        updatedAt: serverTimestamp(),
      };
      
      await setDoc(doc(db, 'invoices', invoice.id), invoiceData);
      alert('Invoice saved to cloud!');
    } catch (e) {
      console.error("Error saving invoice: ", e);
      alert('Failed to save invoice.');
    }
  };

  const handleNew = () => {
    setInvoice({ ...INITIAL_INVOICE, id: generateId() });
  };

  const handleDownload = async () => {
    const element = document.getElementById('invoice-preview');
    if (!element) return;
    const html2pdf = (await import('html2pdf.js')).default;
    const opt = {
      margin: 10,
      filename: `Invoice_${invoice.invoiceNumber}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };
    html2pdf().from(element).set(opt).save();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'invoices', id));
      if (invoice.id === id) handleNew();
    } catch (e) {
      console.error("Error deleting invoice: ", e);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Plus size={40} className="spinner" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          <button className="mobile-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
          <div className="logo-section">
            <motion.div 
              className="app-logo-container"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <img src={logo} alt="ProInvoice" className="app-logo" />
            </motion.div>
            <h1>ProInvoice</h1>
          </div>
        </div>

        <div className="header-right">
          <div className="user-profile hide-mobile">
            <UserIcon size={16} />
            <span>{user.email}</span>
          </div>
          <button className="btn-logout" onClick={handleLogout} title="Logout">
            <LogOut size={18} />
          </button>
          <motion.button 
            className="btn-new" 
            onClick={handleNew}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={18} /> <span className="hide-mobile">Create New</span>
          </motion.button>
        </div>
      </header>

      <main className="app-content">
        <AnimatePresence>
          {(isSidebarOpen || window.innerWidth > 1024) && (
            <motion.aside 
              className="app-sidebar"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <SavedInvoices 
                invoices={savedInvoices} 
                onSelect={(inv) => { setInvoice(inv); setIsSidebarOpen(false); }} 
                onDelete={handleDelete}
                activeId={invoice.id}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        <motion.section 
          className="form-area"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <InvoiceActions 
            onSave={handleSave} 
            onDownload={handleDownload} 
            onPrint={handlePrint} 
          />
          <InvoiceForm invoice={invoice} setInvoice={setInvoice} />
          <div className="form-footer-actions">
            <motion.button 
              className="btn-primary" 
              onClick={handleSave}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={18} /> Save to Cloud
            </motion.button>
            <motion.button 
              className="btn-outline"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Share2 size={18} /> Share Invoice
            </motion.button>
          </div>
        </motion.section>

        <motion.section 
          className="preview-area"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <InvoicePreview invoice={invoice} />
        </motion.section>
      </main>

      <style>{`
        .app-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .loading-screen {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-main);
          color: var(--primary);
        }
        .app-header {
          background: var(--white);
          padding: 8px 24px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: var(--bg-subtle);
          border-radius: 20px;
          font-size: 0.75rem;
          color: var(--text-muted);
          border: 1px solid var(--border);
        }
        .btn-logout {
          padding: 8px;
          border-radius: 8px;
          color: var(--text-muted);
          transition: all 0.2s;
        }
        .btn-logout:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }
        .mobile-toggle {
          display: none;
          background: none;
          color: var(--text-main);
          padding: 8px;
        }
        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .app-logo-container {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .app-logo {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .logo-section h1 {
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: -1px;
          color: var(--text-main);
          background: linear-gradient(135deg, var(--primary), var(--primary-hover));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .btn-new {
          background: var(--secondary);
          color: var(--primary);
          padding: 8px 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          border: 1px solid var(--primary);
        }
        .app-content {
          display: grid;
          grid-template-columns: 300px 1fr 1.2fr;
          gap: 24px;
          padding: 24px;
          flex: 1;
        }
        .app-sidebar {
          height: calc(100vh - 100px);
          position: sticky;
          top: 80px;
          overflow-y: auto;
          background: var(--white);
          padding: 10px;
          border-radius: var(--radius);
        }
        .form-footer-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 32px;
          padding-top: 32px;
          border-top: 1px solid var(--border);
        }
        .form-footer-actions .btn-primary {
          justify-content: center;
          padding: 14px;
          font-size: 1rem;
        }
        .form-footer-actions .btn-outline {
          justify-content: center;
          padding: 14px;
          font-size: 1rem;
        }
        .preview-area {
          perspective: 1000px;
        }
        @media (max-width: 1600px) {
          .app-content {
            grid-template-columns: 280px 1fr 1fr;
          }
        }
        @media (max-width: 1400px) {
          .app-content {
            grid-template-columns: 280px 1fr;
          }
          .preview-area {
            display: none;
          }
        }
        @media (max-width: 1024px) {
          .app-content {
            grid-template-columns: 1fr;
          }
          .app-sidebar {
            position: fixed;
            top: 60px;
            left: 0;
            bottom: 0;
            z-index: 999;
            width: 280px;
            box-shadow: var(--shadow-lg);
          }
          .mobile-toggle {
            display: block;
          }
          .hide-mobile {
            display: none;
          }
          .form-footer-actions {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 640px) {
          .app-content {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
