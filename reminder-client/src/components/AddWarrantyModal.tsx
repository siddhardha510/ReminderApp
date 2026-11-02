import React, { useState } from 'react';
import { reminderApi } from '../api/reminders';
import { X, ShieldAlert, Calendar, Camera, FileText, AlertCircle } from 'lucide-react';

interface AddWarrantyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onWarrantyCreated: () => void;
}

const COMMON_CATEGORIES = [
    'Electronics & Gadgets',
    'Home Appliances',
    'Automobile / Vehicle',
    'Furniture',
    'Watches & Wearables',
    'Other',
];

export const AddWarrantyModal: React.FC<AddWarrantyModalProps> = ({
    isOpen,
    onClose,
    onWarrantyCreated,
}) => {
    const [itemName, setItemName] = useState('');
    const [category, setCategory] = useState(COMMON_CATEGORIES[0]);
    const [purchaseDate, setPurchaseDate] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [notes, setNotes] = useState('');
    const [invoicePhoto, setInvoicePhoto] = useState<File | null>(null);
    const [itemPhoto, setItemPhoto] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!itemName.trim()) {
            setError('Item name is required.');
            return;
        }

        if (!purchaseDate || !expiryDate) {
            setError('Both purchase date and expiry date are required.');
            return;
        }

        if (new Date(expiryDate) <= new Date(purchaseDate)) {
            setError('Expiry date must be after the purchase date.');
            return;
        }

        setLoading(true);
        try {
            const createdWarranty = await reminderApi.createWarranty({
                itemName: itemName.trim(),
                category,
                purchaseDate,
                expiryDate,
                notes: notes.trim() || undefined,
            });

            if ((invoicePhoto || itemPhoto) && createdWarranty.id) {
                await reminderApi.uploadWarrantyPhotos(createdWarranty.id, invoicePhoto, itemPhoto);
            }

            // Reset form
            setItemName('');
            setCategory(COMMON_CATEGORIES[0]);
            setPurchaseDate('');
            setExpiryDate('');
            setNotes('');
            setInvoicePhoto(null);
            setItemPhoto(null);

            onWarrantyCreated();
            onClose();
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || 'Failed to save warranty.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className= "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs" >
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[90vh] overflow-y-auto" >
        {/* Header */ }
            < div className = "flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70 sticky top-0 bg-white z-10" >
                <div className="flex items-center gap-2" >
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700" >
                        <ShieldAlert className="w-5 h-5" />
                            </div>
                            < div >
                            <h3 className="font-bold text-slate-900 text-base" > Track Item Warranty </h3>
                                < p className = "text-xs text-slate-500" > Alerts you 30 days prior to warranty expiration </p>
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
        Product / Item Name
            </label>
            < input
type = "text"
required
value = { itemName }
onChange = {(e) => setItemName(e.target.value)}
placeholder = "e.g. Sony Bravia 55' OLED or Apple Watch"
className = "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
    />
    </div>

    < div >
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1" >
        Category
        </label>
        < select
value = { category }
onChange = {(e) => setCategory(e.target.value)}
className = "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
    >
{
    COMMON_CATEGORIES.map((cat) => (
        <option key= { cat } value = { cat } >
        { cat }
        </option>
    ))
}
    </select>
    </div>

    < div className = "grid grid-cols-1 sm:grid-cols-2 gap-4" >
        <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1" >
            Purchase Date
                </label>
                < div className = "relative" >
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <input
                  type="date"
required
value = { purchaseDate }
onChange = {(e) => setPurchaseDate(e.target.value)}
className = "w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
    />
    </div>
    </div>

    < div >
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1" >
        Warranty Expiry Date
            </label>
            < div className = "relative" >
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                  type="date"
required
value = { expiryDate }
onChange = {(e) => setExpiryDate(e.target.value)}
className = "w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
    />
    </div>
    </div>
    </div>

{/* Photo Upload Section */ }
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2" >
    <div>
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1" >
        Invoice / Bill(Image)
        </label>
        < label className = "cursor-pointer flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl bg-slate-50 transition text-center" >
            <FileText className="w-5 h-5 text-indigo-500 mb-1" />
                <span className="text-xs font-medium text-slate-700" >
                { invoicePhoto? invoicePhoto.name : 'Upload Invoice'}
                    </span>
                    < input
type = "file"
accept = "image/*"
className = "hidden"
onChange = {(e) => setInvoicePhoto(e.target.files?.[0] || null)}
                />
    </label>
    </div>

    < div >
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1" >
        Product Photo(Optional)
            </label>
            < label className = "cursor-pointer flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl bg-slate-50 transition text-center" >
                <Camera className="w-5 h-5 text-slate-500 mb-1" />
                    <span className="text-xs font-medium text-slate-700" >
                    { itemPhoto? itemPhoto.name : 'Upload Item Pic'}
                        </span>
                        < input
type = "file"
accept = "image/*"
className = "hidden"
onChange = {(e) => setItemPhoto(e.target.files?.[0] || null)}
                />
    </label>
    </div>
    </div>

    < div >
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1" >
        Notes(Optional)
        </label>
        < textarea
rows = { 2}
value = { notes }
onChange = {(e) => setNotes(e.target.value)}
placeholder = "e.g. Serial Number, Extended AppleCare details, or Store contact"
className = "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-none"
    />
    </div>

{/* Action Buttons */ }
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
className = "px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
    >
{
    loading?(
                <div className = "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ): (
            'Save Warranty'
        )
}
    </button>
    </div>
    </form>
    </div>
    </div>
  );
};