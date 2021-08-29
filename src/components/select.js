const Select = ({
  options = [], label = 'Select', withLabel = false, value, onChange, status = 'default', className, style, ...rest
}) => {
  const border = {
    default: 'border-gray-700',
    error: 'border-red-600',
  }[status];
  return (
    <label style={style} className="block">
      <span className={withLabel ? 'block text-gray-300 text-sm font-medium mb-1' : 'sr-only'}>{label}</span>
      <select
        value={value}
        onChange={onChange}
        className={
          `block w-full bg-gray-900 rounded-md ${border} shadow-sm focus:border-green-700 focus:ring focus:ring-green-800 focus:ring-opacity-50 ${className}`
        }
        {...rest}
      >
        {
          options.map((option) => (
            <option key={option.value} value={String(option.value)}>{option.label}</option>
          ))
        }
      </select>
    </label>
  )
}

export default Select;