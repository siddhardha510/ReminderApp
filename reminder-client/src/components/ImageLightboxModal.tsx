import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Download, ExternalLink } from 'lucide-react';

interface ImageLightboxModalProps {
    isOpen: boolean;
    imageUrl: string | null;
    title?: string;
    onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
    isOpen,
    imageUrl,
    title = 'Document Preview',
    onClose,
}) => {
    const [isZoomed, setIsZoomed] = useState(false);

    // Close modal on Escape key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Reset zoom level on image change or reopen
    useEffect(() => {
        setIsZoomed(false);
    }, [imageUrl, isOpen]);

    if (!isOpen || !imageUrl) return null;

    const fullUrl = imageUrl.startsWith('http')
        ? imageUrl
        : `https://localhost:44399${imageUrl}`;

    return (
        <div className= "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-150" >
        {/* Top action bar */ }
        < div className = "absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20 pointer-events-none" >
            <div className="bg-slate-900/70 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md pointer-events-auto" >
                <p className="text-sm font-semibold tracking-wide text-slate-100" > { title } </p>
                    </div>

                    < div className = "flex items-center gap-2 bg-slate-900/70 border border-white/10 p-1.5 rounded-xl backdrop-blur-md pointer-events-auto" >
                        <button
            onClick={ () => setIsZoomed((prev) => !prev) }
    title = { isZoomed? 'Zoom Out': 'Zoom In' }
    className = "p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
        >
        { isZoomed?<ZoomOut className = "w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
</button>

    < a
href = { fullUrl }
target = "_blank"
rel = "noopener noreferrer"
title = "Open original in new tab"
className = "p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
    >
    <ExternalLink className="w-5 h-5" />
        </a>

        < a
href = { fullUrl }
download
title = "Download document"
className = "p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
    >
    <Download className="w-5 h-5" />
        </a>

        < div className = "w-px h-5 bg-white/20 mx-1" />

            <button
            onClick={ onClose }
title = "Close (Esc)"
className = "p-2 text-slate-300 hover:text-rose-400 hover:bg-white/10 rounded-lg transition cursor-pointer"
    >
    <X className="w-5 h-5" />
        </button>
        </div>
        </div>

{/* Main Image Container */ }
<div
        className="w-full h-full flex items-center justify-center overflow-auto p-4 cursor-pointer"
onClick = {(e) => {
    if (e.target === e.currentTarget) onClose();
}}
      >
    <img
          src={ fullUrl }
alt = { title }
onClick = {() => setIsZoomed((prev) => !prev)}
className = {`max-h-[85vh] object-contain rounded-lg shadow-2xl transition-transform duration-200 cursor-zoom-in ${isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100'
    }`}
        />
    </div>
    </div>
  );
};