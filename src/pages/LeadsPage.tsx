import { useEffect, useMemo, useState, useCallback } from 'react';
import { useTable, useGlobalFilter, useSortBy, usePagination } from 'react-table';
import { toast } from 'sonner';
import Modal from '../components/Modal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LeadsPage = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtherJobType, setShowOtherJobType] = useState(false);
  const [formData, setFormData] = useState({
    mobile: '',
    is_whatsapp_number_same: 1,
    whatsapp_number: '',
    name: '',
    dob: new Date().toISOString().split('T')[0],
    age: '',
    education: '',
    state: '',
    city: '',
    past_job: '',
    job_type: '',
    willing_to_relocate: 1,
    call_status: 1,
    experience: 0,
    id: null,
    status_text: '',
    follow_up_date: new Date().toISOString().split('T')[0],
  });

  const educationOptions = [
    { value: '', label: 'Select Education' },
    { value: 'Below 10th', label: 'Below 10th' },
    { value: '10th Pass', label: '10th Pass' },
    { value: '12th Pass', label: '12th Pass' },
    { value: 'Graduate', label: 'Graduate' },
  ];

  const callStatusOptions = [
    { value: 1, label: 'Answered' },
    { value: 2, label: 'Not Received' },
    { value: 3, label: 'Disconnected' },
    { value: 4, label: 'Talk Future' },
    { value: 5, label: 'Not Interested' },
  ];

  const jobTypeOptions = [
    { value: 'Driver', label: 'Driver' },
    { value: 'Electrician', label: 'Electrician' },
    { value: 'Plumber', label: 'Plumber' },
    { value: 'Sales Person', label: 'Sales Person' },
    { value: 'Delivery Boy', label: 'Delivery Boy' },
    { value: 'Tution Teacher', label: 'Tution Teacher' },
    { value: 'Packing', label: 'Packing' },
    { value: 'Carpenter', label: 'Carpenter' },
    { value: 'Security Guard', label: 'Security Guard' },
    { value: 'Labour (House)', label: 'Labour (House)' },
    { value: 'House Keeping', label: 'House Keeping' },
    { value: 'Other', label: 'Other' },
  ];

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/lead_list`);
      const json = await res.json();
      setData(json.data || []);
    } catch (error) {
      toast.error('Failed to fetch leads');
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchLeadById = useCallback(async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/lead_by_id/${id}`);
      const json = await res.json();
      if (json.status) {
        const leadData = {
          ...json.data,
          dob: json.data.dob.split('T')[0],
          follow_up_date: json.data.follow_up_date?.split('T')[0] || new Date().toISOString().split('T')[0],
        };
        setFormData(leadData);
        setShowOtherJobType(!jobTypeOptions.some(opt => opt.value === leadData.job_type));
        setShowModal(true);
      }
    } catch (error) {
      toast.error('Failed to fetch lead details');
      console.error('Fetch error:', error);
    }
  }, []);

  function calculateAge(dob :any) {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
  
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
  
    // Adjust if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
  
    return age >= 0 ? age : null;
  }
  

  const handleSubmit = async () => {
    if (!formData.mobile) {
      toast.error('Mobile number is required');
      return;
    }

    setIsSubmitting(true);
    try {
      let payload: any = {
        mobile: formData.mobile,
        is_whatsapp_number_same: formData.is_whatsapp_number_same,
        whatsapp_number: formData.whatsapp_number,
        name: formData.name,
        dob: formData.dob,
        age: formData.age,
        education: formData.education,
        state: formData.state,
        city: formData.city,
        past_job: formData.past_job,
        job_type: formData.job_type,
        willing_to_relocate: formData.willing_to_relocate,
        call_status: formData.call_status,
        experience: formData.experience,
      };

      if (formData.id) {
        payload.id = formData.id;
      }

      const url = formData.id ? `${API_BASE_URL}/users/update_lead` : `${API_BASE_URL}/users/leads`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const json = await res.json();
      if (json.status) {
        toast.success(formData.id ? 'Lead updated successfully' : 'Lead created successfully');
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

  const handleJobTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setShowOtherJobType(value === 'Other');
    setFormData({ ...formData, job_type: value });
  };

  const columns = useMemo(() => [
    { Header: 'Mobile', accessor: 'mobile' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'WhatsApp', accessor: 'whatsapp_number' },
    { 
      Header: 'Same WhatsApp', 
      accessor: 'is_whatsapp_number_same',
      Cell: ({ value }: { value: number }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value === 1 ? 'Yes' : 'No'}
        </span>
      )
    },
    { 
      Header: 'Education', 
      accessor: 'education',
      Cell: ({ value }: { value: string }) => (
        <span className="text-sm font-medium text-gray-700">{value || '-'}</span>
      )
    },
    { Header: 'Age', accessor: 'age' },
    { Header: 'State', accessor: 'state' },
    { Header: 'City', accessor: 'city' },
    { Header: 'Past Job', accessor: 'past_job' },
    { Header: 'Job Type', accessor: 'job_type' },
    { 
      Header: 'Relocate', 
      accessor: 'willing_to_relocate',
      Cell: ({ value }: { value: number }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value === 1 ? 'Yes' : 'No'}
        </span>
      )
    },
    { 
      Header: 'Experience', 
      accessor: 'experience',
      Cell: ({ value }: { value: string }) => (
        <span className="text-sm font-medium text-gray-700">{value || '-'} yrs</span>
      )
    },
    { 
      Header: 'Call Status', 
      accessor: 'call_status',
      Cell: ({ value }: { value: number }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 1 ? 'bg-green-100 text-green-800' :
          value === 2 ? 'bg-red-100 text-red-800' :
          value === 3 ? 'bg-yellow-100 text-yellow-800' :
          value === 4 ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {callStatusOptions.find(opt => opt.value === value)?.label || 'Unknown'}
        </span>
      )
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }: any) => (
        <button
          onClick={() => fetchLeadById(row.original.id)}
          className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors"
        >
          Edit
        </button>
      ),
    },
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
        <div className="flex justify-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Employer Details</h2>
        </div>
                  <div className="relative w-64">
            <input 
              value={globalFilter || ''}
              onChange={e => setGlobalFilter(e.target.value)} 
              placeholder="Search leads..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                is_whatsapp_number_same: 1,
                whatsapp_number: '',
                name: '',
                dob: new Date().toISOString().split('T')[0],
                age: '',
                education: '',
                state: '',
                city: '',
                past_job: '',
                job_type: '',
                willing_to_relocate: 1,
                call_status: 1,
                experience: 0,
                id: null,
                status_text: '',
                follow_up_date: new Date().toISOString().split('T')[0],
              });
              setShowOtherJobType(false);
              setShowModal(true); 
            }} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center transition-colors shadow-md"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Lead
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {headerGroups.map(group => (
                  <tr {...group.getHeaderGroupProps()}>
                    {group.headers.map(column => (
                      <th 
                        {...column.getHeaderProps(column.getSortByToggleProps())} 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center space-x-1">
                          {column.render('Header')}
                          {column.isSorted && (
                            <span className="text-gray-400">
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
                    <tr {...row.getRowProps()} className="hover:bg-gray-50 transition-colors">
                      {row.cells.map(cell => (
                        <td 
                          {...cell.getCellProps()} 
                          className="px-6 py-4 whitespace-nowrap text-sm"
                        >
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button 
            onClick={previousPage} 
            disabled={!previousPage}
            className={`px-4 py-2 rounded-md flex items-center ${
              previousPage 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          <button 
            onClick={nextPage} 
            disabled={!nextPage}
            className={`px-4 py-2 rounded-md flex items-center ${
              nextPage 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {showModal && (
        <Modal 
          title={formData.id ? 'Edit Lead' : 'Add Lead'} 
          onClose={() => setShowModal(false)}
          size="xl"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mobile Number */}
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

              {/* WhatsApp Same */}
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Same WhatsApp Number?</label>
              <select
                value={formData.is_whatsapp_number_same}
                onChange={e => {
                  const val = Number(e.target.value); 
                  setFormData(prev => ({
                    ...prev,
                    is_whatsapp_number_same: val,
                    whatsapp_number: val === 1 ? prev.mobile : '' // auto-fill or clear
                  }));
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                  <option value="">Select</option>
                <option value={1}>Yes</option>
                <option value={0}>No</option>
              </select>
            </div>

            {/* WhatsApp Number (conditionally shown or auto-filled) */}
            <div className="md:col-span-2 mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
              <input
                placeholder="Enter WhatsApp number"
                value={formData.whatsapp_number}
                onChange={e => setFormData({ ...formData, whatsapp_number: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={formData.is_whatsapp_number_same === 1}
              />
            </div>


              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={e => {
                    const dob = e.target.value;
                    const age = calculateAge(dob);
                    setFormData({ ...formData, dob, age: age?.toString() || '' });
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

{/* Age */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
      <input
        placeholder="Enter age"
        value={formData.age}
        onChange={e => setFormData({ ...formData, age: e.target.value })}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        disabled // make age read-only since it's auto-calculated
      />
    </div>


              {/* Education */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                <select
                  value={formData.education}
                  onChange={e => setFormData({ ...formData, education: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  {educationOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  placeholder="Enter state"
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Past Job */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Past Job</label>
                <input
                  placeholder="Enter past job"
                  value={formData.past_job}
                  onChange={e => setFormData({ ...formData, past_job: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select
                  value={formData.job_type}
                  onChange={handleJobTypeChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select Job Type</option>
                  {jobTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {showOtherJobType && (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Enter job type"
                      value={formData.job_type === 'Other' ? '' : formData.job_type}
                      onChange={e => setFormData({ ...formData, job_type: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Willing to Relocate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Willing to Relocate?</label>
                <select
                  value={formData.willing_to_relocate}
                  onChange={e =>
                    setFormData({ ...formData, willing_to_relocate: Number(e.target.value) })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select</option>
                  <option value={1}>Yes</option>
                  <option value={0}>No</option>
                </select>
              </div>


              {/* Call Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Call Status</label>
                <select
                  value={formData.call_status}
                  onChange={e => setFormData({ ...formData, call_status: Number(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  {callStatusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
                <input
                  type="number"
                  placeholder="Enter experience"
                  value={formData.experience}
                  onChange={e => setFormData({ ...formData, experience: Number(e.target.value )})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Follow-up Date */}

              {/* Status Notes */}
            </div>

            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors shadow-md ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Processing...' : formData.id ? 'Update Lead' : 'Add Lead'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LeadsPage;