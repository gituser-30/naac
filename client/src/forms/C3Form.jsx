// client/src/forms/C3Form.jsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  projectTitle: yup.string(),
  piName: yup.string(),
  fundingAgency: yup.string(),
  grantAmount: yup.number().min(0).transform(v => (isNaN(v) ? undefined : v)),
  startDate: yup.date().transform(v => (isNaN(v) ? undefined : v)).nullable(),
  endDate: yup.date().min(yup.ref('startDate'), "End date must be after start date").transform(v => (isNaN(v) ? undefined : v)).nullable(),
  paperTitle: yup.string(),
  journalName: yup.string(),
  ugcListed: yup.string(),
  issnNumber: yup.string().matches(/^\d{4}-\d{4}$/, { message: "Format: XXXX-XXXX", excludeEmptyString: true }),
  bookTitle: yup.string(),
  publisherName: yup.string(),
  publicationYear: yup.string(),
  phdScholarName: yup.string(),
  phdAwardYear: yup.string(),
  eventName: yup.string(),
  eventDate: yup.string(),
  extensionActivity: yup.string(),
  studentsParticipated: yup.number().min(0).transform(v => (isNaN(v) ? undefined : v))
});

const C3Form = ({ initialData, onSave, onSubmit, disabled }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || { ugcListed: 'no' }
  });

  const getYears = () => {
    const years = [];
    for(let i=2024; i>=1990; i--) years.push(i);
    return years;
  };

  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Research Project Title</label>
          <input disabled={disabled} {...register('projectTitle')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Principal Investigator</label>
          <input disabled={disabled} {...register('piName')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Funding Agency</label>
          <input disabled={disabled} {...register('fundingAgency')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Grant Amount (INR)</label>
          <input disabled={disabled} type="number" min="0" {...register('grantAmount')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Project Start Date</label>
          <input disabled={disabled} type="date" {...register('startDate')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Project End Date</label>
          <input disabled={disabled} type="date" {...register('endDate')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate.message}</p>}
        </div>
        
        <div className="col-span-1 md:col-span-2 border-t pt-4 mt-4">
            <h4 className="font-semibold text-gray-800 mb-4">Publications</h4>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Journal Paper Title</label>
          <input disabled={disabled} {...register('paperTitle')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Journal Name</label>
          <input disabled={disabled} {...register('journalName')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">UGC Listed</label>
          <div className="mt-2 space-x-4">
            <label className="inline-flex items-center">
              <input disabled={disabled} type="radio" value="yes" {...register('ugcListed')} className="form-radio text-blue-600" />
              <span className="ml-2 text-sm text-gray-700">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input disabled={disabled} type="radio" value="no" {...register('ugcListed')} className="form-radio text-blue-600" />
              <span className="ml-2 text-sm text-gray-700">No</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">ISSN Number</label>
          <input disabled={disabled} placeholder="XXXX-XXXX" {...register('issnNumber')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          {errors.issnNumber && <p className="text-red-500 text-xs mt-1">{errors.issnNumber.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Book/Chapter Title</label>
          <input disabled={disabled} {...register('bookTitle')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Publisher Name</label>
          <input disabled={disabled} {...register('publisherName')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Year of Publication</label>
          <select disabled={disabled} {...register('publicationYear')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <option value="">Select Year</option>
            {getYears().map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div className="col-span-1 md:col-span-2 border-t pt-4 mt-4">
            <h4 className="font-semibold text-gray-800 mb-4">Other Activities</h4>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">PhD Scholar Name</label>
          <input disabled={disabled} {...register('phdScholarName')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">PhD Awarded Year</label>
          <select disabled={disabled} {...register('phdAwardYear')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <option value="">Select Year</option>
            {getYears().map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Workshop/Seminar Name</label>
          <input disabled={disabled} {...register('eventName')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Event Date</label>
          <input disabled={disabled} type="date" {...register('eventDate')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Extension Activity Name</label>
          <input disabled={disabled} {...register('extensionActivity')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Students Participated</label>
          <input disabled={disabled} type="number" min="0" {...register('studentsParticipated')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
      </div>

      {!disabled && (
        <div className="flex space-x-4 pt-4 border-t border-gray-200">
          <button type="button" onClick={handleSubmit(onSave)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Save Draft</button>
          <button type="button" onClick={handleSubmit(onSubmit)} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Submit for Review</button>
        </div>
      )}
    </form>
  );
};

export default C3Form;
