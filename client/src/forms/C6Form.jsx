// client/src/forms/C6Form.jsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  bodyName: yup.string(),
  meetingDate: yup.string(),
  numAttendees: yup.number().min(0).transform(v => (isNaN(v) ? undefined : v)),
  trainingTitle: yup.string(),
  startDate: yup.string(),
  endDate: yup.string(),
  supportType: yup.string(),
  amountInr: yup.number().min(0).transform(v => (isNaN(v) ? undefined : v)),
  auditType: yup.string(),
  auditDate: yup.string(),
  auditAgency: yup.string(),
  iqacInitiative: yup.string(),
  qualityStatus: yup.string()
});

const C6Form = ({ initialData, onSave, onSubmit, disabled }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || {}
  });

  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2 border-b pb-2 mb-2">
            <h4 className="font-semibold text-gray-800">Governance & Training</h4>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Statutory Body Name</label>
          <input disabled={disabled} {...register('bodyName')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Meeting Date</label>
          <input disabled={disabled} type="date" {...register('meetingDate')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Number of Attendees</label>
          <input disabled={disabled} type="number" min="0" {...register('numAttendees')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div></div>

        <div>
          <label className="block text-sm font-medium text-gray-700">FDP/Training Title</label>
          <input disabled={disabled} {...register('trainingTitle')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Financial Support Type</label>
          <select disabled={disabled} {...register('supportType')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
             <option value="">Select Type</option>
             <option value="Conference/Workshop">Conference/Workshop</option>
             <option value="Membership Fee">Membership Fee</option>
             <option value="Seed Money">Seed Money</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount (INR)</label>
          <input disabled={disabled} type="number" min="0" {...register('amountInr')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div></div>

        <div className="col-span-1 md:col-span-2 border-b pt-4 pb-2 mb-2">
            <h4 className="font-semibold text-gray-800">Quality Assurance</h4>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Audit Type</label>
          <select disabled={disabled} {...register('auditType')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
             <option value="">Select Type</option>
             <option value="Academic">Academic Audit</option>
             <option value="Administrative">Administrative Audit</option>
             <option value="Green">Green Audit</option>
             <option value="Energy">Energy Audit</option>
             <option value="Environment">Environment Audit</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Audit Date</label>
          <input disabled={disabled} type="date" {...register('auditDate')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Audit Agency</label>
          <input disabled={disabled} {...register('auditAgency')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div></div>

        <div>
          <label className="block text-sm font-medium text-gray-700">IQAC Initiative Title</label>
          <input disabled={disabled} {...register('iqacInitiative')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Quality Status</label>
          <input disabled={disabled} {...register('qualityStatus')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
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

export default C6Form;
