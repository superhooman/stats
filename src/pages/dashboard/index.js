import { useLayoutEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ChartPieIcon, PencilIcon } from '@heroicons/react/solid'
import axios from 'axios';
import { format, parse } from "date-fns";
import { ru } from 'date-fns/locale'
import Loader from '../../components/loader';
import Button from '../../components/button';
import Modal, {Title as ModalTitle, Actions as ModalActions} from '../../components/modal';
import labels from '../../labels';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/outline';

const Import = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [md, setMd] = useState(false);
    const [response, setResponse] = useState({
        id: null,
        data: [],
        open: false
    })
    useLayoutEffect(() => {
        setMd(!!(typeof window !== 'undefined' && window.document && window.document.createElement))
    }, [])
    const upload = (file) => {
        setLoading(true);
        const fd = new FormData();
        fd.append('file', file);
        axios({
            url: '/data/upload',
            method: 'POST',
            data: fd,
        }).then((res) => {
            if (res.data && res.data.success) {
                setResponse({
                    id: res.data.import.id,
                    data: res.data.import.data,
                    open: true
                })
            }
            setLoading(false);
        }).catch((err) => {
            if (err.response && err.response.data) {
                setLoading(false);
                alert(err.response.data.error)
            }
        });
    };
    const finish = (id) => {
        setLoading(true);
        axios({
            url: "/data/finish/" + id
        }).then((res) => {
            if(res.data && res.data.success){
                alert("Импортировано");
                router.push("/");
            }
        })
    }
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
        onDrop: (e) => {
            const fr = new FileReader();
            fr.onload = () => {
                upload(e[0]);
            };
            if (e[0]) {
                fr.readAsDataURL(e[0]);
            }
        },
    });

    const classes = useMemo(() => {
        const rejected = isDragReject ? 'border-red-500' : '';
        return `${isDragActive || isDragAccept ? 'border-indigo-500' : (rejected)}`;
    }, [isDragAccept, isDragActive, isDragReject]);

    return (
        <>
            <div className="min-h-screen p-6 flex items-stretch">
                <div
                    className={`${classes} cursor-pointer rounded-lg border border-dashed border-gray-600 w-full flex items-center justify-center `}
                    {...getRootProps()}
                >
                    <input {...getInputProps()} />
                    <div>
                        Нажмите или перетащите сюда файл
                    </div>
                </div>
            </div>
            <Link href="/dashboard/vaccinated">
                <a className="fixed flex p-4 rounded-full bg-green-600 items-center justify-center bottom-44 right-5">
                    <ChartPieIcon className="h-6 w-6" />
                </a>
            </Link>
            <Link href="/dashboard/edit">
                <a className="fixed flex p-4 rounded-full bg-green-600 items-center justify-center bottom-24 right-5">
                    <PencilIcon className="h-6 w-6" />
                </a>
            </Link>
            <Link href="/dashboard/manual">
                <a className="fixed flex p-4 rounded-full bg-green-600 items-center justify-center bottom-5 right-5">
                    <PlusIcon className="h-6 w-6" />
                </a>
            </Link>
            {md ? <Modal open={response.open} close={() => setResponse((v) => ({ ...v, open: false }))}>
                <ModalTitle>Будут импортированы следующие данные:</ModalTitle>
                {response.data.map((el) => (
                    <div key={`${el.reg.key}-${el.reg.child ? "child" : "main"}`} className="m-2 px-4 py-2 bg-gray-700 rounded">
                        <h4>{labels[el.reg.key]}</h4>
                        {el.reg.child ? <div className="font-normal text-xs my-1 py-1 px-2 rounded-full bg-gray-500 w-min whitespace-nowrap">Подрядные орг.</div> : null}
                        <div className="opacity-60 text-sm"><span>{el.value}</span> • <span>{format(new Date(el.date), 'd LLL y', { locale: ru })}</span></div>
                        {el.children.length ? (
                            <div className="divide-y divide-gray-600 divide-solid">
                                {el.children.map((p,i) => (
                                <p className="py-2 text-sm" key={`${el.reg.key}-${el.reg.child ? "child" : "main"}-${i}`}>{p}</p>
                            ))}
                            </div>
                        ) : (null)}
                    </div>
                ))}
                <ModalActions>
                    <Button onClick={() => finish(response.id)}>Импортировать</Button>
                    <Button onClick={() => setResponse((v) => ({ ...v, open: false }))} >Закрыть</Button>
                </ModalActions>
            </Modal> : null}
            {loading ? (
                <div className="flex z-50 items-center justify-center fixed top-0 left-0 w-full h-full bg-black bg-opacity-20">
                    <Loader/>
                </div>
            ) : null}
        </>
    )
}

export default Import;