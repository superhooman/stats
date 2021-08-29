import { useRouter } from 'next/router';
import Link from 'next/link';

const NavLink = ({href, children, className, icon, ...rest}) => {
  const router = useRouter();
  const active = router.asPath === href;
  return(
    <Link href={href}>
        {typeof children === 'string' ? (
        <a className={`font-medium leading-tight ${icon && children ? 'flex items-center' : 'block'} bg-white bg-opacity-0 hover:bg-opacity-20 py-2 px-3 rounded-lg mb-2 ${active ? 'bg-opacity-10' : ''}  ${className}`} {...rest}>
          {icon ? <div className={`h-5 w-5 ${children ? 'mr-2': "mx-auto"}`}>{icon}</div> : null}
          <span className="flex-1">{children}</span>
        </a>
      ) : children}
    </Link>
)
}

export default NavLink;