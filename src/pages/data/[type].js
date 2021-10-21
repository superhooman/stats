import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import Loader from '../../components/loader';
import Page from '../../components/page';

const Detail = () => {
    const router = useRouter();
    const { type } = router.query;
    if (!type) {
        return (
            <Loader />
        )
    }
    return <Page type={type} />
}

Detail.getLayout = page => (
    <Layout>
        {page}
    </Layout>
)

export default Detail