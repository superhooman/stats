const Input = ({
    type = 'text', placeholder = '', label = 'Input', withLabel = false, value, onChange, status = 'default', className, style, icon, ...rest
}) => {
    const border = {
        default: 'border-gray-700',
        error: 'border-red-600',
    }[status];
    return (
        // eslint-disable-next-line jsx-a11y/label-has-associated-control
        <label style={style} className="block relative">
            <span className={withLabel ? 'block text-gray-300 text-sm font-medium mb-1' : 'sr-only'}>{label}</span>
            {icon ? <div className="icon pointer-events-none text-gray-300 w-5 h-5 absolute bottom-3 left-3">{icon}</div> : null}
            {type === 'textarea' ? (
                <textarea
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    style={{
                        minHeight: 42,
                    }}
                    className={
                        `block w-full bg-gray-900 rounded-md ${border} shadow-sm focus:border-green-700 focus:ring focus:ring-green-800 focus:ring-opacity-50 ${icon ? 'pl-10' : ''} ${className}`
                    }
                    {...rest}
                />
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={
                        `block w-full bg-gray-900 rounded-md ${border} shadow-sm focus:border-green-700 focus:ring focus:ring-green-800 focus:ring-opacity-50 ${icon ? 'pl-10' : ''} ${className}`
                    }
                    {...{
                        ...rest,
                        children: null,
                    }}
                />
            )}
        </label>
    );
};

export default Input;
