// client/src/forms/C2Form.jsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  studentName: yup.string().required('Required'),
  rollNumber: yup.string().required('Required'),
  category: yup.string().required('Required'),
  yearOfAdmission: yup.string().required('Required'),
  facultyName: yup.string().required('Required'),
  designation: yup.string(),
  highestQualification: yup.string(),
  publications: yup.number().min(0).transform(value => (isNaN(value) ? undefined : value)),
  ictTools: yup.array().of(yup.string()),
  iaMarks: yup.number().min(0).max(100).transform(value => (isNaN(value) ? undefined : value)),
  passY1: yup.number().min(0).max(100).transform(value => (isNaN(value) ? undefined : value)),
  passY2: yup.number().min(0).max(100).transform(value => (isNaN(value) ? undefined : value)),
  passY3: yup.number().min(0).max(100).transform(value => (isNaN(value) ? undefined : value)),
  passY4: yup.number().min(0).max(100).transform(value => (isNaN(value) ? undefined : value)),
  passY5: yup.number().min(0).max(100).transform(value => (isNaN(value) ? undefined : value)),
  slowLearnerStrategies: yup.string().min(20).required('Required')
});

const C2Form = ({ initialData, onSave, onSubmit, disabled }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || { ictTools: [] }
  });

  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Student Full Name *</label>
          <input disabled={disabled} {...register('studentName')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
          {errors.studentName && <p className="text-red-500 text-xs mt-1">{errors.studentName.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Roll Number *</label>
          <input disabled={disabled} {...register('rollNumber')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
          {errors.rollNumber && <p className="text-red-500 text-xs mt-1">{errors.rollNumber.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category *</label>
          <select disabled={disabled} {...register('category')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
            <option value="">Select Category</option>
            <option value="General">General</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="PH">PH</option>
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Year of Admission *</label>
          <select disabled={disabled} {...register('yearOfAdmission')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
            <option value="">Select Year</option>
            {['2016', '2017', '2018', '2019', '2020', '2021'].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          {errors.yearOfAdmission && <p className="text-red-500 text-xs mt-1">{errors.yearOfAdmission.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Faculty Name *</label>
          <input disabled={disabled} {...register('facultyName')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
          {errors.facultyName && <p className="text-red-500 text-xs mt-1">{errors.facultyName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Designation</label>
          <select disabled={disabled} {...register('designation')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
            <option value="">Select Designation</option>
            <option value="Professor">Professor</option>
            <option value="Asst. Professor">Asst. Professor</option>
            <option value="Guest Faculty">Guest Faculty</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Highest Qualification</label>
          <select disabled={disabled} {...register('highestQualification')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
            <option value="">Select</option>
            <option value="UG">UG</option>
            <option value="PG">PG</option>
            <option value="M.Phil">M.Phil</option>
            <option value="Ph.D">Ph.D</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Number of Publications</label>
          <input disabled={disabled} type="number" min="0" {...register('publications')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">ICT Tools Used</label>
          <div className="flex flex-wrap gap-4">
            {['PPT', 'LMS', 'Videos', 'CDs', 'Software'].map(tool => (
              <label key={tool} className="inline-flex items-center">
                <input disabled={disabled} type="checkbox" value={tool} {...register('ictTools')} className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                <span className="ml-2 text-sm text-gray-700">{tool}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Internal Assessment Marks (Max 100)</label>
          <input disabled={disabled} type="number" min="0" max="100" {...register('iaMarks')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
        </div>
        
        <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Pass Percentage Year-wise (%)</label>
            <div className="grid grid-cols-5 gap-4">
                {['passY1', 'passY2', 'passY3', 'passY4', 'passY5'].map((y, idx) => (
                    <input disabled={disabled} key={y} type="number" min="0" max="100" placeholder={`Y${idx+1}`} {...register(y)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                ))}
            </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Special Strategies for Slow Learners *</label>
          <textarea disabled={disabled} rows="4" {...register('slowLearnerStrategies')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" placeholder="Minimum 20 characters"></textarea>
          {errors.slowLearnerStrategies && <p className="text-red-500 text-xs mt-1">{errors.slowLearnerStrategies.message}</p>}
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

export default C2Form;
