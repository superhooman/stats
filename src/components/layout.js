import NavLink from "./navLink";
import { 
    HomeIcon, 
    ChartSquareBarIcon, 
    ExclamationIcon, 
    LockClosedIcon,
    FireIcon,
    InformationCircleIcon,
    BeakerIcon,
    LightningBoltIcon,
    AcademicCapIcon,
    ArchiveIcon,
    XIcon,
    MenuIcon
} from '@heroicons/react/outline';
import { useState } from "react";
import labels from '../labels';

const icons = {
    incidents: <ExclamationIcon/>,
    security: <LockClosedIcon/>,
    accidents: <FireIcon/>,
    pnb: <InformationCircleIcon/>,
    pollution: <BeakerIcon/>,
    failures: <LightningBoltIcon/>,
    edu: <AcademicCapIcon/>
}

const links = [
    {
        path: '/',
        title: 'Главный экран',
        icon: <HomeIcon/>
    },
    {
        path: '/vaccination',
        title: 'Вакцинация',
        icon: <ChartSquareBarIcon/>
    },
    ...Object.keys(labels).map((key) => ({
        path: `/data/${key}`,
        title: labels[key],
        icon: icons[key] || <ArchiveIcon/>
    }))
]

const Layout = ({children}) => {
    const [open, setOpen] = useState(true);
    return(
        <div className="flex items-stretch">
            <div className={`bg-gray-800 min-h-screen ${open ? 'w-72' : 'w-20'}`}>
                <div className="flex items-center p-6 bg-gray-700">
                    <button onClick={() => setOpen(!open)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-600">
                        <div className="w-5 h-5">
                            {open ? <XIcon/> : <MenuIcon/>}
                        </div>
                    </button>
                    {open ? <span className="font-bold ml-3">Меню</span> : null}
                </div>
                <div className="grid-cols-1 gap-4 py-6 px-4">
                    {links.map((link) => (
                        <NavLink key={link.path} icon={link.icon} href={link.path}>{open ? link.title : ""}</NavLink>
                    ))}
                </div>
            </div>
            <div className="flex-1 p-4 border-l border-gray-600">
                {children}
            </div>
        </div>
    )
}

const Wrapper = ({children}) => (
    <div>
        <Layout>
            {children}
        </Layout>
    </div>
)

export default Wrapper;