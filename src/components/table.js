const HeaderExample = [
  {
    label: 'Name',
    prop: 'name',
  },
  {
    label: 'Title',
    prop: 'title',
  },
  {
    label: 'Status',
    prop: 'status',
  },
  {
    label: 'Role',
    prop: 'role',
  },
  {
    label: <span className="sr-only">Edit</span>,
    prop: 'edit',
  },
];

const DataExample = [
  {
    title: (
      <>
        <div className="text-sm text-white">Regional Paradigm Technician</div>
        <div className="text-sm text-gray-500">Optimization</div>
      </>
    ),
    status: (
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
        Active
      </span>
    ),
    role: 'Admin',
    edit: <a href="#" className="text-indigo-600 text-sm hover:text-indigo-900">Edit</a>,
  },
];

const HeaderCell = ({ label, className = '' }) => (
  <th scope="col" className={`p-0 text-left whitespace-nowrap text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
    <div className="px-6 py-3">
      {label}
    </div>
  </th>
);

const Table = ({
  headers = HeaderExample, data = DataExample, loading = [], isFetching = false
}) => (
  <div className="shadow border-b md:border border-gray-800 overflow-hidden md:rounded-lg -mx-4 md:mx-0 ">
    <div className="w-full overflow-scroll">
      <table className="divide-y divide-gray-800 min-w-full">
        <thead className="bg-gray-800">
          <tr>
            {headers.map((header) => (
              <HeaderCell {...header} key={header.prop} />
            ))}
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-800 align-top">
          {!isFetching ? data.map((row, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <tr key={`row-${i}`}>
              {headers.map((col) => (
                <td key={col.prop} className={`p-0 ${col.nowrap ? "whitespace-nowrap" : ""}`}>
                  <div className="px-6 py-4">
                    {typeof row[col.prop] === 'string' ? (
                      <span className="text-gray-500">{row[col.prop]}</span>
                    ) : row[col.prop]}
                  </div>
                </td>
              ))}
            </tr>
          )) : loading.map((row, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <tr key={`row-${i}`}>
              {headers.map((col) => (
                <td key={col.prop} className="p-0">
                  <div className="px-6 py-4">
                    {typeof row[col.prop] === 'string' ? (
                      <span className="text-gray-500">{row[col.prop]}</span>
                    ) : row[col.prop]}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default Table;
