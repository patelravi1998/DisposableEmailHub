import { useEffect, useMemo, useState, useCallback } from 'react';
import { useTable, useGlobalFilter, useSortBy, usePagination } from 'react-table';
import { toast } from 'sonner';
import Modal from '../components/Modal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LeadStatusPage = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    mobile: '',
    called_date: new Date().toISOString().split('T')[0],
    id: null,
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/lead_status_list`);
      const json = await res.json();
      setData(json.data || []);
    } catch (error) {
      toast.error('Failed to fetch lead status');
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async () => {
    if (!formData.mobile) {
      toast.error('Mobile number is required');
      return;
    }

    setIsSubmitting(true);
    try {
      let payload: any = {
        mobile: formData.mobile,
        called_date: formData.called_date,
      };

      if (formData.id) {
        payload.id = formData.id;
      }

      const method = formData.id ? 'update_lead_status' : 'lead_status';
      
      const res = await fetch(`${API_BASE_URL}/users/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.status) {
        toast.success('Saved successfully');
        setShowModal(false);
        fetchData();
      } else {
        toast.error(json.error.message || 'Operation failed');
      }
    } catch (error) {
      toast.error('Error saving data');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = useMemo(() => [
    { Header: 'Mobile', accessor: 'mobile' },
    { 
      Header: 'Called Date', 
      accessor: 'called_date',
      Cell: ({ value }: { value: string }) => (
        <span>{new Date(value).toLocaleDateString()}</span>
      )
    },
    { Header: 'Created At', accessor: 'created_at' },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }: any) => (
        <button 
          onClick={() => {
            setFormData({
              ...row.original,
              called_date: row.original.called_date.split('T')[0]
            });
            setShowModal(true);
          }} 
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Edit
        </button>
      )
    }
  ], []);

  const tableInstance = useTable(
    { 
      columns, 
      data,
      initialState: { pageIndex: 0, pageSize: 10 } 
    }, 
    useGlobalFilter, 
    useSortBy, 
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setGlobalFilter,
    nextPage,
    previousPage,
    state: { globalFilter }
  } = tableInstance;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <input 
              value={globalFilter || ''}
              onChange={e => setGlobalFilter(e.target.value)} 
              placeholder="Search leads..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg 
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button 
            onClick={() => { 
              setFormData({
                mobile: '', 
                called_date: new Date().toISOString().split('T')[0],
                id: null
              }); 
              setShowModal(true); 
            }} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Lead
          </button>
        </div>

        <div className="overflow-x-auto">
          <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {headerGroups.map(group => (
                <tr {...group.getHeaderGroupProps()}>
                  {group.headers.map(column => (
                    <th 
                      {...column.getHeaderProps(column.getSortByToggleProps())} 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center">
                        {column.render('Header')}
                        {column.isSorted && (
                          <span className="ml-1">
                            {column.isSortedDesc ? '↓' : '↑'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
              {page.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="hover:bg-gray-50">
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button 
            onClick={previousPage} 
            disabled={!previousPage}
            className={`px-4 py-2 rounded-md ${previousPage ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          >
            Previous
          </button>
          <button 
            onClick={nextPage} 
            disabled={!nextPage}
            className={`px-4 py-2 rounded-md ${nextPage ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          >
            Next
          </button>
        </div>
      </div>

      {showModal && (
        <Modal 
          title={formData.id ? 'Edit Lead Status' : 'Add Lead Status'} 
          onClose={() => setShowModal(false)}
          size="md"
        >
          <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number*</label>
                <input
                    placeholder="Enter mobile number"
                    value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                    ${formData.id ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
                    required
                    disabled={!!formData.id}
                />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Called Date</label>
              <input 
                type="date" 
                value={formData.called_date} 
                onChange={e => setFormData({ ...formData, called_date: e.target.value })} 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="pt-2">
              <button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className={`w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Processing...' : formData.id ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LeadStatusPage;