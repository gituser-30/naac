// client/src/forms/C5Form.jsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  schemeName: yup.string(),
  numStudentsBenefited: yup.number().min(0).transform(v => (isNaN(v) ? undefined : v)),
  amountInr: yup.number().min(0).transform(v => (isNaN(v) ? undefined : v)),
  agencyName: yup.string(),
  examName: yup.string(),
  studentsAppeared: yup.number().min(0).transform(v => (isNaN(v) ? undefined : v)),
  studentsPassed: yup.number().min(0).transform(v => (isNaN(v) ? undefined : v)),
  companyName: yup.string(),
  packageLpa: yup.number().min(0).transform(v => (isNaN(v) ? undefined : v)),
  institutionJoined: yup.string(),
  programAdmitted: yup.string(),
  awardName: yup.string(),
  awardLevel: yup.string()
});

const C5Form = ({ initialData, onSave, onSubmit, disabled }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || {}
  });

  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2 border-b pb-2 mb-2">
            <h4 className="font-semibold text-gray-800">Scholarships & Freeships</h4>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Scheme Name</label>
          <input disabled={disabled} {...register('schemeName')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Providing Agency</label>
          <select disabled={disabled} {...register('agencyName')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
             <option value="">Select Agency</option>
             <option value="Government">Government</option>
             <option value="Institution">Institution</option>
             <option value="NGO">NGO</option>
             <option value="Private">Private</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Students Benefited</label>
          <input disabled={disabled} type="number" min="0" {...register('numStudentsBenefited')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Total Amount (INR)</label>
          <input disabled={disabled} type="number" min="0" {...register('amountInr')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>

        <div className="col-span-1 md:col-span-2 border-b pt-4 pb-2 mb-2">
            <h4 className="font-semibold text-gray-800">Competitive Exams & Placements</h4>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Exam Name</label>
          <select disabled={disabled} {...register('examName')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <option value="">Select Exam</option>
            <option value="NET">NET</option>
            <option value="SLET">SLET</option>
            <option value="GATE">GATE</option>
            <option value="GMAT">GMAT</option>
            <option value="CAT">CAT</option>
            <option value="GRE">GRE</option>
            <option value="TOEFL">TOEFL</option>
            <option value="Civil Services">Civil Services</option>
            <option value="State Govt Exams">State Govt Exams</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Students Appeared</label>
          <input disabled={disabled} type="number" min="0" {...register('studentsAppeared')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Students Passed</label>
          <input disabled={disabled} type="number" min="0" {...register('studentsPassed')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div></div> 

        <div>
          <label className="block text-sm font-medium text-gray-700">Placed Company Name</label>
          <input disabled={disabled} {...register('companyName')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Package (LPA)</label>
          <input disabled={disabled} type="number" min="0" step="0.01" {...register('packageLpa')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>

        <div className="col-span-1 md:col-span-2 border-b pt-4 pb-2 mb-2">
            <h4 className="font-semibold text-gray-800">Higher Education & Awards</h4>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Institution Joined</label>
          <input disabled={disabled} {...register('institutionJoined')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Program Admitted To</label>
          <input disabled={disabled} {...register('programAdmitted')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Award/Medal Name</label>
          <input disabled={disabled} {...register('awardName')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Award Level</label>
          <select disabled={disabled} {...register('awardLevel')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
             <option value="">Select Level</option>
             <option value="University">University</option>
             <option value="State">State</option>
             <option value="National">National</option>
             <option value="International">International</option>
          </select>
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

export default C5Form;
