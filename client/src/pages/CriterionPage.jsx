// client/src/pages/CriterionPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import FileUploader from '../components/FileUploader';
import FileList from '../components/FileList';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';

// Dynamic imports for forms
import C1Form from '../forms/C1Form';
import C2Form from '../forms/C2Form';
import C3Form from '../forms/C3Form';
import C4Form from '../forms/C4Form';
import C5Form from '../forms/C5Form';
import C6Form from '../forms/C6Form';
import C7Form from '../forms/C7Form';

const formComponents = {
    1: C1Form, 2: C2Form, 3: C3Form, 4: C4Form, 5: C5Form, 6: C6Form, 7: C7Form
};

const subCriteriaMap = {
    1: ['1.1.1', '1.2.1', '1.3.1', '1.4.1'],
    2: ['2.1.1', '2.2.1', '2.3.1', '2.4.1', '2.5.1', '2.6.1', '2.7.1'],
    3: ['3.1.1', '3.2.1', '3.3.1', '3.4.1'],
    4: ['4.1.1', '4.2.1', '4.3.1', '4.4.1'],
    5: ['5.1.1', '5.2.1', '5.3.1', '5.4.1'],
    6: ['6.1.1', '6.2.1', '6.3.1', '6.4.1', '6.5.1'],
    7: ['7.1.1', '7.2.1', '7.3.1']
};

const CriterionPage = () => {
    const { criterionId } = useParams();
    const navigate = useNavigate();
    const [activeSub, setActiveSub] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const FormComponent = formComponents[criterionId];

    const fetchData = async (subCrit) => {
        setLoading(true);
        try {
            const subRes = await axiosInstance.get(`/criteria/${criterionId}/${subCrit}`);
            setSubmission(subRes.data);
            
            if (subRes.data) {
                const docRes = await axiosInstance.get(`/upload/list/${subRes.data._id}`);
                setDocuments(docRes.data.filter(d => d.subCriterion === subCrit));
            } else {
                setDocuments([]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!subCriteriaMap[criterionId]) {
            navigate('/dashboard');
            return;
        }
        
        const initialSub = subCriteriaMap[criterionId][0];
        setActiveSub(initialSub);
        fetchData(initialSub);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [criterionId]);

    const handleSubChange = (sub) => {
        setActiveSub(sub);
        fetchData(sub);
    };

    const handleSave = async (formData, status = 'draft') => {
        try {
            const payload = { formData, status, academicYear: formData.academicYear || '2023-24' };
            const res = await axiosInstance.post(`/criteria/${criterionId}/${activeSub}`, payload);
            setSubmission(res.data);
            toast.success(status === 'submitted' ? 'Submitted successfully' : 'Draft saved');
            if(!submission) fetchData(activeSub); // refresh to get ID for file uploads
        } catch (err) {
            console.error(err);
        }
    };

    const handleSingleDownload = async (type) => {
        if (!submission?._id) return;
        try {
            const res = await axiosInstance.get(`/export/${type}/submission/${submission._id}`, { responseType: 'blob' });
            const blob = new Blob([res.data]);
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `NAAC_Verified_C${criterionId}_${activeSub}.${type === 'pdf' ? 'pdf' : 'xlsx'}`;
            link.click();
        } catch (err) {
            console.error(err);
            toast.error(`Failed to download ${type.toUpperCase()}`);
        }
    };

    if (loading && !activeSub) return <LoadingSpinner />;
    if (!FormComponent) return <p className="text-white text-center mt-20">Invalid Criterion</p>;

    const isVerified = submission?.status === 'verified';
    const needsRevision = submission?.status === 'needs_revision';
    const isSubmitted = submission?.status === 'submitted';

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12 pt-6">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-6 rounded-2xl flex justify-between items-center relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="z-10">
                    <button onClick={() => navigate('/dashboard')} className="text-primary-400 hover:text-primary-300 transition-colors mb-2 text-sm font-medium inline-flex items-center">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-white flex items-center">
                        <FileText className="w-8 h-8 mr-3 text-primary-400" />
                        Criterion {criterionId}
                    </h1>
                </div>
            </motion.div>

            {/* Sub-criteria Tabs */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex overflow-x-auto border-b border-white/10 mb-6 space-x-2 custom-scrollbar pb-1"
            >
                {subCriteriaMap[criterionId].map((sub, index) => (
                    <button
                        key={sub}
                        onClick={() => handleSubChange(sub)}
                        className={`px-6 py-3 font-medium text-sm transition-all whitespace-nowrap rounded-t-lg relative ${
                            activeSub === sub 
                                ? 'text-primary-400 bg-primary-500/10' 
                                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                        }`}
                    >
                        Sub {sub}
                        {activeSub === sub && (
                            <motion.div 
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                            />
                        )}
                    </button>
                ))}
            </motion.div>

            <AnimatePresence mode="wait">
                {loading ? <LoadingSpinner key="loader" /> : (
                    <motion.div 
                        key={activeSub}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Status Banners */}
                        {isVerified && (
                            <div className="mb-6 glass-panel border-l-4 border-l-green-500 p-4 rounded-r-2xl flex items-center justify-between shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                <div className="flex items-center">
                                    <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                                    <p className="text-green-400 font-medium">Verified by HOD</p>
                                </div>
                                <div className="flex space-x-3">
                                    <button onClick={() => handleSingleDownload('pdf')} className="text-sm bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-1.5 rounded transition-colors border border-green-500/30">
                                        Download PDF
                                    </button>
                                    <button onClick={() => handleSingleDownload('excel')} className="text-sm bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-1.5 rounded transition-colors border border-green-500/30">
                                        Download Excel
                                    </button>
                                </div>
                            </div>
                        )}
                        {needsRevision && (
                            <div className="mb-6 glass-panel border-l-4 border-l-red-500 p-4 rounded-r-2xl shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                                <div className="flex items-center mb-1">
                                    <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
                                    <p className="text-red-400 font-bold">Needs Revision</p>
                                </div>
                                <p className="text-sm text-gray-300 ml-9 mt-1 p-2 bg-surfaceHover rounded-lg border border-white/5">
                                    <span className="text-red-400 font-semibold">HOD Comment:</span> {submission.hodComment}
                                </p>
                            </div>
                        )}
                        {isSubmitted && !isVerified && !needsRevision && (
                            <div className="mb-6 glass-panel border-l-4 border-l-yellow-500 p-4 rounded-r-2xl flex items-center shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                                <Clock className="w-6 h-6 text-yellow-500 mr-3" />
                                <p className="text-yellow-400 font-medium">Submitted for review</p>
                            </div>
                        )}

                        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
                             {/* Styling the form children globally via css or nesting */}
                            <div className={`${(isVerified || isSubmitted) ? 'opacity-80 pointer-events-none' : ''}`}>
                                <FormComponent 
                                    initialData={submission?.formData} 
                                    onSave={(data) => handleSave(data, 'draft')}
                                    onSubmit={(data) => {
                                        if(window.confirm('Are you sure you want to submit? You cannot edit this until HOD reviews it.')) {
                                            handleSave(data, 'submitted');
                                        }
                                    }}
                                    disabled={isVerified || isSubmitted}
                                />
                            </div>
                        </div>

                        <div className="mt-8 glass-panel rounded-2xl p-6 relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                            <h3 className="text-xl font-bold text-white mb-2 relative z-10">Supporting Documents</h3>
                            <p className="text-sm text-gray-400 mb-6 relative z-10">Upload all necessary PDF/Excel evidence for {activeSub}.</p>
                            
                            <div className="relative z-10">
                                {!(isVerified || isSubmitted) && (
                                    <div className="mb-6">
                                        <FileUploader 
                                            criterionId={criterionId} 
                                            subCriterion={activeSub} 
                                            submissionId={submission?._id}
                                            onUploadSuccess={() => fetchData(activeSub)}
                                        />
                                    </div>
                                )}
                                
                                <FileList 
                                    documents={documents} 
                                    onDeleteSuccess={() => fetchData(activeSub)}
                                    readonly={isVerified || isSubmitted}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CriterionPage;
