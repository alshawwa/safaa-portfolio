import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

const API_URL = 'http://127.0.0.1:8000/api';

export function AdminGuard() {
    const [status, setStatus] = useState<
        'checking' | 'authenticated' | 'unauthenticated' | 'error'
    >('checking');

    const [retry, setRetry] = useState(0);

    useEffect(() => {
        let cancelled = false;

        const verifyAdmin = async () => {
            const token = localStorage.getItem('admin_token');

            if (!token) {
                setStatus('unauthenticated');
                return;
            }

            setStatus('checking');

            try {
                const response = await fetch(`${API_URL}/me`, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (cancelled) return;

                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('admin_token');
                    setStatus('unauthenticated');
                    return;
                }

                if (!response.ok) {
                    setStatus('error');
                    return;
                }

                setStatus('authenticated');
            } catch {
                if (!cancelled) {
                    setStatus('error');
                }
            }
        };

        verifyAdmin();

        return () => {
            cancelled = true;
        };
    }, [retry]);

    if (status === 'checking') {
        return <div className="p-8 text-center">Verifying admin access...</div>;
    }

    if (status === 'error') {
        return (
            <div className="p-8 text-center">
                <p className="mb-4 text-[#746673]">
                    Unable to connect to the server. Please check Laravel.
                </p>
                <button
                    onClick={() => setRetry((value) => value + 1)}
                    className="rounded-xl bg-[#9878E8] px-5 py-2 text-white"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
}