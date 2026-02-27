import Layout from '@/components/layout/Layout';
import { accountFPSidebarItems } from '@/data/sidebarData';
import { useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useModuleAccess from '@/permissions/useModuleAccess';

const AccountFP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const checkModule = useModuleAccess();

    const firstAvailableRoute = useMemo(() => {
        const availableItem = accountFPSidebarItems.find(item =>
            !item.module || checkModule(item.module)
        );
        return availableItem?.link || '/account';
    }, [checkModule]);

    useEffect(() => {
        if (location.pathname === '/account' || location.pathname === '/account/') {
            navigate(firstAvailableRoute, { replace: true });
        }
    }, [location.pathname, navigate, firstAvailableRoute]);

    return (
        <Layout sidebarItems={accountFPSidebarItems}>
            <h1 className="text-xl font-semibold p-6">Accounting FP Content</h1>
        </Layout>
    );
};

export default AccountFP;