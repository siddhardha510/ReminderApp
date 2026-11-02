import React, { useState } from 'react';
import { reminderApi } from '../api/reminders';
import { X, CreditCard, DollarSign, Calendar, Upload, AlertCircle } from 'lucide-react';

interface AddBillModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBillCreated: () => void;
}

const CATEGORIES = [
    { id: 0, name: 'EMI' },
    { id: 1, name: 'Credit Card' },
    { id: 2, name: 'Utilities (Electricity/Water)' },
    { id: 3, name: 'Subscription' },
    { id: 4, name: 'Other' },
];

export const AddBillModal: React.FC<AddBillModalProps> = ({ isOpen, onClose, onBillCreated }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<number>(1);
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setError('Please provide a valid amount greater than 0.');
            return;
        }

        if (!dueDate) {
            setError('Please select a due date.');
            return;
        }

        setLoading(true);
        try {
            const createdBill = await reminderApi.createBill({
                title: title.trim(),
                category,
                amount: parsedAmount,
                dueDate,
            });

            if (receiptFile && createdBill.id) {
                await reminderApi.uploadBillReceipt(createdBill.id, receiptFile);
            }

            // Reset and close
            setTitle('');
            setCategory(1);
            setAmount('');
            setDueDate('');
            setReceiptFile(null);
            onBillCreated();
            onClose();
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || 'Failed to save bill.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className= "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs" >
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150" >
        {/* Header */ }
            < div className = "flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70" >
                <div className="flex items-center gap-2" >
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-700" >
                        <CreditCard className="w-5 h-5" />
                            </div>
                            < div >
                            <h3 className="font-bold text-slate-900 text-base" > Add New Bill / Due </h3>
                                < p className = "text-xs text-slate-500" > Track recurring expenses or card dues </p>
                                    </div>
                                    </div>
                                    < button
    onClick = { onClose }
    className = "p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
        >
        <X className="w-5 h-5" />
            </button>
            </div>

    {/* Form Body */ }
    <form onSubmit={ handleSubmit } className = "p-6 space-y-4" >
    { error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2" >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{ error } </span>
                    </div>
          )}

<div>
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1" >
        Bill Title / Provider
            </label>
            < input
type = "text"
required
value = { title }
onChange = {(e) => setTitle(e.target.value)}
placeholder = "e.g. HDFC Credit Card or Home WiFi"
className = "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
    />
    </div>

    < div className = "grid grid-cols-1 sm:grid-cols-2 gap-4" >
        <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1" >
            Category
            </label>
            < select
value = { category }
onChange = {(e) => setCategory(Number(e.target.value))}
className = "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
    >
{
    CATEGORIES.map((cat) => (
        <option key= { cat.id } value = { cat.id } >
        { cat.name }
        </option>
    ))
}
    </select>
    </div>

    < div >
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1" >
        Amount(₹ / $)
        </label>
        < div className = "relative" >
            <DollarSign className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="number"
step = "0.01"
required
value = { amount }
onChange = {(e) => setAmount(e.target.value)}
placeholder = "2499.00"
className = "w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
    />
    </div>
    </div>
    </div>

    < div >
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1" >
        Due Date
            </label>
            < div className = "relative" >
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                type="date"
required
value = { dueDate }
onChange = {(e) => setDueDate(e.target.value)}
className = "w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
    />
    </div>
    < p className = "text-[11px] text-slate-400 mt-1" >
        An automated notification will trigger 24 hours prior to this date.
            </p>
            </div>

            < div >
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1" >
                Bill / Invoice Receipt(Optional)
                    </label>
                    < div className = "flex items-center gap-2" >
                        <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition" >
                            <Upload className="w-4 h-4 text-slate-500" />
                                <span>{ receiptFile? 'Change File': 'Choose Receipt' } </span>
                                < input
type = "file"
accept = "image/*,application/pdf"
className = "hidden"
onChange = {(e) => setReceiptFile(e.target.files?.[0] || null)}
                />
    </label>
{
    receiptFile && (
        <span className="text-xs text-slate-600 truncate max-w-[200px]" >
        { receiptFile.name }
            </span>
              )
}
</div>
    </div>

{/* Actions */ }
<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100" >
    <button
              type="button"
onClick = { onClose }
disabled = { loading }
className = "px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition"
    >
    Cancel
    </button>
    < button
type = "submit"
disabled = { loading }
className = "px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
    >
{
    loading?(
                <div className = "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ): (
            'Save Bill'
        )
}
    </button>
    </div>
    </form>
    </div>
    </div>
  );
};