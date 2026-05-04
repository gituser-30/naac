// client/src/forms/C7Form.jsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  programTitle: yup.string(),
  dateFrom: yup.string(),
  dateTo: yup.string(),
  numParticipants: yup.number().min(0).transform(v => (isNaN(v) ? undefined : v)),
  facilityName: yup.string(),
  facilityType: yup.string(),
  bestPracticeTitle: yup.string(),
  practiceObjective: yup.string(),
  practiceContext: yup.string()
});

const C7Form = ({ initialData, onSave, onSubmit, disabled }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || {}
  });

  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2 border-b pb-2 mb-2">
            <h4 className="font-semibold text-gray-800">Gender Equity & Values</h4>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Program Title</label>
          <input disabled={disabled} {...register('programTitle')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Participants Count</label>
          <input disabled={disabled} type="number" min="0" {...register('numParticipants')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date From</label>
          <input disabled={disabled} type="date" {...register('dateFrom')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date To</label>
          <input disabled={disabled} type="date" {...register('dateTo')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>

        <div className="col-span-1 md:col-span-2 border-b pt-4 pb-2 mb-2">
            <h4 className="font-semibold text-gray-800">Environmental Consciousness</h4>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Facility Name</label>
          <input disabled={disabled} {...register('facilityName')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Facility Type</label>
          <select disabled={disabled} {...register('facilityType')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
             <option value="">Select Type</option>
             <option value="Solar Energy">Solar Energy</option>
             <option value="Biogas Plant">Biogas Plant</option>
             <option value="Wheeling to Grid">Wheeling to Grid</option>
             <option value="Sensor-based Energy">Sensor-based Energy</option>
             <option value="LED Usage">LED Usage</option>
             <option value="Waste Management">Waste Management</option>
             <option value="Water Conservation">Water Conservation</option>
          </select>
        </div>

        <div className="col-span-1 md:col-span-2 border-b pt-4 pb-2 mb-2">
            <h4 className="font-semibold text-gray-800">Best Practices</h4>
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Title of the Practice</label>
          <input disabled={disabled} {...register('bestPracticeTitle')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Objectives of the Practice</label>
          <textarea disabled={disabled} rows="3" {...register('practiceObjective')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Context & Implementation</label>
          <textarea disabled={disabled} rows="4" {...register('practiceContext')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
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

export default C7Form;
