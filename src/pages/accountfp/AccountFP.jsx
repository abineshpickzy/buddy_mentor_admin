import Layout from '@/components/layout/Layout';
import { accountFPSidebarItems } from '@/data/sidebarData';

const AccountFP = () => {
    return (
        <Layout sidebarItems={accountFPSidebarItems}>
            <h1 className="text-xl font-semibold">Accounting FP Content</h1>
        </Layout>
    );
};

export default AccountFP;