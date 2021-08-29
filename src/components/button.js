const Button = ({ icon, children, className, ...rest }) => (
    <button className={`appearance-none flex items-center disabled:opacity-60 focus:outline-none focus:ring focus:border-green-400 ring-green-500 ring-opacity-50 py-2 px-4 bg-gray-800 border border-gray-600 rounded-lg ${className}`} {...rest}>
        {icon ? <div className="w-6 h-6">
            {icon}
        </div> : null}
        {children ? <span className={icon ? 'ml-2' : 'w-full block text-center'}>{children}</span> : null}
    </button>
)

export default Button;