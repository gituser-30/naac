// client/src/forms/C4Form.jsx
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  facilityType: yup.string().required('Facility Type is required'),
  roomNumber: yup.string().required('Room Number/Name is required'),
  areaSqft: yup.number().min(1, 'Must be at least 1').required('Area is required').transform(v => (isNaN(v) ? undefined : v)),
  seatingCapacity: yup.number().min(1, 'Must be at least 1').required('Capacity is required').transform(v => (isNaN(v) ? undefined : v)),
  numSystems: yup.number().min(0).transform(v => (isNaN(v) ? undefined : v)),
  equipmentName: yup.string(),
  equipmentModel: yup.string(),
  purchaseYear: yup.string(),
  costInr: yup.number().min(0).transform(v => (isNaN(v) ? undefined : v))
});

const C4Form = ({ initialData, onSave, onSubmit, disabled }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || {}
  });

  const facilityType = useWatch({ control, name: 'facilityType' });
  const getYears = () => {
    const years = [];
    for(let i=2024; i>=1990; i--) years.push(i);
    return years;
  };

  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Facility Type *</label>
          <select disabled={disabled} {...register('facilityType')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <option value="">Select Type</option>
            <option value="Classroom">Classroom</option>
            <option value="Lab">Lab</option>
            <option value="Computer Lab">Computer Lab</option>
            <option value="Research Facility">Research Facility</option>
          </select>
          {errors.facilityType && <p className="text-red-500 text-xs mt-1">{errors.facilityType.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Room Number/Name *</label>
          <input disabled={disabled} {...register('roomNumber')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          {errors.roomNumber && <p className="text-red-500 text-xs mt-1">{errors.roomNumber.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Area (sqft) *</label>
          <input disabled={disabled} type="number" min="1" {...register('areaSqft')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          {errors.areaSqft && <p className="text-red-500 text-xs mt-1">{errors.areaSqft.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Seating Capacity *</label>
          <input disabled={disabled} type="number" min="1" {...register('seatingCapacity')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          {errors.seatingCapacity && <p className="text-red-500 text-xs mt-1">{errors.seatingCapacity.message}</p>}
        </div>

        {facilityType === 'Computer Lab' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Systems</label>
              <input disabled={disabled} type="number" min="0" {...register('numSystems')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
        )}

        <div className="col-span-1 md:col-span-2 border-t pt-4 mt-2">
            <h4 className="font-semibold text-gray-800 mb-4">Equipment Details</h4>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Equipment Name</label>
          <input disabled={disabled} {...register('equipmentName')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Equipment Make & Model</label>
          <input disabled={disabled} {...register('equipmentModel')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Year of Purchase</label>
          <select disabled={disabled} {...register('purchaseYear')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <option value="">Select Year</option>
            {getYears().map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cost (INR)</label>
          <input disabled={disabled} type="number" min="0" {...register('costInr')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
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

export default C4Form;
