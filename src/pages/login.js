import {useContext, useState } from 'react';
import axios from 'axios';
import Input from '../components/input';
import Button from '../components/button';
import GlobalContext from '../utils/globalContext';
import { useRouter } from 'next/router';

const Login = () => {
    const router = useRouter();
    const [state, setState] = useState({
        email: "",
        password: ""
    })
    const {setUser} = useContext(GlobalContext)
    const login = () => {
        axios({
            url: '/user/login',
            method: "POST",
            data: state
        }).then((res) => {
            if(res.data && res.data.success){
                setUser(res.data.user);
                router.push("/dashboard")
            }
        }).catch((err) => {
            if(err.response && err.response.data){
                alert(err.response.data.error === "request.auth" ? "Неверные данные" : err.response.data.error);
            }
        })
    }
    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={e => {
                e.preventDefault();
                login();
            }} className="max-w-xl p-6 mx-4 w-full bg-gray-800 rounded-lg">
                <h2 className="font-bold text-3xl mb-4">Войти</h2>
                <div className="mb-4">
                    <Input withLabel label="Логин" type="email" value={state.email} onChange={e => {
                        const { value } = e.target
                        setState(v => ({ ...v, email: value }))
                    }} />
                </div>
                <div className="mb-4">
                    <Input withLabel label="Пароль" type="password" value={state.password} onChange={e => {
                        const { value } = e.target
                        setState(v => ({ ...v, password: value }))
                    }} />
                </div>
                <Button>Войти</Button>
            </form>
        </div>
    )
}

export default Login;