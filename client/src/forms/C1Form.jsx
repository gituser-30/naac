// client/src/forms/C1Form.jsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  programmeName: yup.string().required('Programme Name is required'),
  academicYear: yup.string().required('Academic Year is required'),
  courseType: yup.string(),
  newProgramme: yup.string().required('Please select Yes or No'),
  bosMemberName: yup.string(),
  bosNominationDate: yup.string(),
  fieldProjectTitle: yup.string(),
  internshipOrg: yup.string(),
  valueAddedCourse: yup.string(),
  feedbackCollected: yup.string()
});

const C1Form = ({ initialData, onSave, onSubmit, disabled }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || { newProgramme: 'no', feedbackCollected: 'no' }
  });

  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Programme Name *</label>
          <input disabled={disabled} {...register('programmeName')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
          {errors.programmeName && <p className="text-red-500 text-xs mt-1">{errors.programmeName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Academic Year *</label>
          <select disabled={disabled} {...register('academicYear')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
            <option value="">Select Year</option>
            <option value="2016-17">2016-17</option>
            <option value="2017-18">2017-18</option>
            <option value="2018-19">2018-19</option>
            <option value="2019-20">2019-20</option>
            <option value="2020-21">2020-21</option>
          </select>
          {errors.academicYear && <p className="text-red-500 text-xs mt-1">{errors.academicYear.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Course Type</label>
          <select disabled={disabled} {...register('courseType')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
            <option value="">Select Type</option>
            <option value="Core">Core</option>
            <option value="Elective">Elective</option>
            <option value="Practical">Practical</option>
            <option value="Open">Open</option>
            <option value="Audit">Audit</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">New Programme Introduced *</label>
          <div className="mt-2 space-x-4">
            <label className="inline-flex items-center">
              <input disabled={disabled} type="radio" value="yes" {...register('newProgramme')} className="form-radio text-blue-600" />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input disabled={disabled} type="radio" value="no" {...register('newProgramme')} className="form-radio text-blue-600" />
              <span className="ml-2">No</span>
            </label>
          </div>
          {errors.newProgramme && <p className="text-red-500 text-xs mt-1">{errors.newProgramme.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">BoS Member Name</label>
          <input disabled={disabled} {...register('bosMemberName')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">BoS Nomination Date</label>
          <input disabled={disabled} type="date" {...register('bosNominationDate')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Field Project Title</label>
          <input disabled={disabled} {...register('fieldProjectTitle')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Internship Organisation</label>
          <input disabled={disabled} {...register('internshipOrg')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Value Added Course Name</label>
          <input disabled={disabled} {...register('valueAddedCourse')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Feedback Collected</label>
          <div className="mt-2 space-x-4">
            <label className="inline-flex items-center">
              <input disabled={disabled} type="radio" value="yes" {...register('feedbackCollected')} className="form-radio text-blue-600" />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input disabled={disabled} type="radio" value="no" {...register('feedbackCollected')} className="form-radio text-blue-600" />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>
      </div>

      {!disabled && (
        <div className="flex space-x-4 pt-4 border-t border-gray-200">
          <button type="button" onClick={handleSubmit(onSave)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Save Draft
          </button>
          <button type="button" onClick={handleSubmit(onSubmit)} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Submit for Review
          </button>
        </div>
      )}
    </form>
  );
};

export default C1Form;
