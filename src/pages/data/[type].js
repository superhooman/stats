import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import Loader from '../../components/loader';
import Page from '../../components/page';

const ignoreDate = [
    'pnb',
    'med'
]

const Detail = () => {
    const router = useRouter();
    const { type } = router.query;
    if (!type) {
        return (
            <Loader />
        )
    }
    return <Page type={type} ignoreDate={ignoreDate.indexOf(type) > -1} />
}

Detail.getLayout = page => (
    <Layout>
        {page}
    </Layout>
)

export default Detail