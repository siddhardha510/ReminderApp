import { useState, useEffect } from 'react';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { AddBillModal } from './components/AddBillModal';
import { AddWarrantyModal } from './components/AddWarrantyModal';
import { ImageLightboxModal } from './components/ImageLightboxModal';

export function App() {
    const [token, setToken] = useState<string | null>(null);
    const [isBillModalOpen, setIsBillModalOpen] = useState(false);
    const [isWarrantyModalOpen, setIsWarrantyModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Lightbox State
    const [lightboxState, setLightboxState] = useState<{
        isOpen: boolean;
        imageUrl: string | null;
        title: string;
    }>({
        isOpen: false,
        imageUrl: null,
        title: '',
    });

    useEffect(() => {
        const savedToken = localStorage.getItem('accessToken');
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setToken(null);
    };

    const handleOpenAddModal = (type: 'bill' | 'warranty') => {
        if (type === 'bill') {
            setIsBillModalOpen(true);
        } else {
            setIsWarrantyModalOpen(true);
        }
    };

    const handleOpenLightbox = (imageUrl: string, title: string) => {
        setLightboxState({
            isOpen: true,
            imageUrl,
            title,
        });
    };

    const handleCloseLightbox = () => {
        setLightboxState((prev) => ({ ...prev, isOpen: false }));
    };

    if (!token) {
        return <AuthPage onAuthSuccess={ (newToken) => setToken(newToken) } />;
    }

    return (
        <>
        <DashboardPage
        key= { refreshTrigger }
    onLogout = { handleLogout }
    onOpenAddModal = { handleOpenAddModal }
    onViewImage = { handleOpenLightbox }
        />

        <AddBillModal
        isOpen={ isBillModalOpen }
    onClose = {() => setIsBillModalOpen(false)
}
onBillCreated = {() => setRefreshTrigger((prev) => prev + 1)}
      />

    < AddWarrantyModal
isOpen = { isWarrantyModalOpen }
onClose = {() => setIsWarrantyModalOpen(false)}
onWarrantyCreated = {() => setRefreshTrigger((prev) => prev + 1)}
      />

    < ImageLightboxModal
isOpen = { lightboxState.isOpen }
imageUrl = { lightboxState.imageUrl }
title = { lightboxState.title }
onClose = { handleCloseLightbox }
    />
    </>
  );
}

export default App;