export interface Bill {
    id: string;
    title: string;
    amount: number;
    category: string;
    dueDate: string;
    status?: string;
    receiptUrl?: string;
    reminderSent?: boolean;
}

export interface Warranty {
    id: string;
    itemName: string;
    category: string;
    purchaseDate: string;
    expiryDate: string;
    notes?: string;
    invoicePhotoUrl?: string;
    itemPhotoUrl?: string;
    reminderSent?: boolean;
}

export interface SearchItem {
    id: string;
    title: string;
    type: string;
    category: string;
    date: string;
}