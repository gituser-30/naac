// client/src/pages/HODTeacherView.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import FileList from '../components/FileList';
import { ArrowLeft, User, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

// Dynamic imports for forms (readonly)
import C1Form from '../forms/C1Form';
import C2Form from '../forms/C2Form';
import C3Form from '../forms/C3Form';
import C4Form from '../forms/C4Form';
import C5Form from '../forms/C5Form';
import C6Form from '../forms/C6Form';
import C7Form from '../forms/C7Form';

const formComponents = { 1: C1Form, 2: C2Form, 3: C3Form, 4: C4Form, 5: C5Form, 6: C6Form, 7: C7Form };

const HODTeacherView = () => {
    const { uid } = useParams();
    const navigate = useNavigate();
    const [teacherData, setTeacherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeCrit, setActiveCrit] = useState(1);
    const [activeSub, setActiveSub] = useState('1.1.1');
    const [comment, setComment] = useState('');
    const [showCommentBox, setShowCommentBox] = useState(false);

    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const res = await axiosInstance.get(`/hod/teacher/${uid}`);
                setTeacherData(res.data);
            } catch (err) {
                console.error(err);
                toast.error('Failed to load teacher data');
            } finally {
                setLoading(false);
            }
        };
        fetchTeacher();
    }, [uid]);

    if (loading) return <LoadingSpinner />;
    if (!teacherData) return <div className="text-center mt-20 text-gray-400">Teacher Not Found</div>;

    const { user, submissions, documents } = teacherData;
    const currentSub = submissions.find(s => s.criterionId === activeCrit && s.subCriterion === activeSub);
    const currentDocs = documents.filter(d => d.criterionId === activeCrit && d.subCriterion === activeSub);
    const FormComponent = formComponents[activeCrit];

    const subCriteriaMap = {
        1: ['1.1.1', '1.2.1', '1.3.1', '1.4.1'],
        2: ['2.1.1', '2.2.1', '2.3.1', '2.4.1', '2.5.1', '2.6.1', '2.7.1'],
        3: ['3.1.1', '3.2.1', '3.3.1', '3.4.1'],
        4: ['4.1.1', '4.2.1', '4.3.1', '4.4.1'],
        5: ['5.1.1', '5.2.1', '5.3.1', '5.4.1'],
        6: ['6.1.1', '6.2.1', '6.3.1', '6.4.1', '6.5.1'],
        7: ['7.1.1', '7.2.1', '7.3.1']
    };

    const handleVerify = async (status) => {
        if (!currentSub) return;
        if (status === 'needs_revision' && !comment.trim()) {
            toast.error('Please provide a comment for revision.');
            return;
        }

        try {
            const res = await axiosInstance.patch(`/hod/verify/${currentSub._id}`, { status, comment });
            
            // Update local state
            const updatedSubs = submissions.map(s => s._id === currentSub._id ? res.data : s);
            setTeacherData({ ...teacherData, submissions: updatedSubs });
            
            toast.success(`Submission marked as ${status.replace('_', ' ')}`);
            setShowCommentBox(false);
            setComment('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleSingleDownload = async (type) => {
        if (!currentSub?._id) return;
        try {
            const res = await axiosInstance.get(`/export/${type}/submission/${currentSub._id}`, { responseType: 'blob' });
            const blob = new Blob([res.data]);
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `NAAC_Verified_C${activeCrit}_${activeSub}.${type === 'pdf' ? 'pdf' : 'xlsx'}`;
            link.click();
        } catch (err) {
            console.error(err);
            toast.error(`Failed to download ${type.toUpperCase()}`);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12 pt-6">
            <button onClick={() => navigate('/hod-dashboard')} className="text-primary-400 hover:text-primary-300 transition-colors mb-2 text-sm font-medium inline-flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </button>
            
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-6 rounded-2xl flex justify-between items-center relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="z-10">
                    <h1 className="text-2xl font-bold text-white flex items-center">
                        <User className="w-6 h-6 mr-3 text-primary-400" />
                        {user.name}
                    </h1>
                    <p className="text-gray-400 mt-1">{user.department} | {user.email}</p>
                </div>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar for Navigation */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-full lg:w-72 flex-shrink-0"
                >
                    <div className="glass-panel rounded-2xl overflow-hidden">
                        {[1,2,3,4,5,6,7].map(c => (
                            <div key={c}>
                                <button 
                                    onClick={() => { setActiveCrit(c); setActiveSub(subCriteriaMap[c][0]); }}
                                    className={`w-full text-left px-4 py-4 font-medium border-b border-white/5 transition-colors ${activeCrit === c ? 'bg-primary-500/10 text-primary-400' : 'text-gray-400 hover:bg-white/5'}`}
                                >
                                    Criterion {c}
                                </button>
                                {activeCrit === c && (
                                    <div className="bg-surface/50 pl-6 pr-4 py-2 border-b border-white/5">
                                        {subCriteriaMap[c].map(sub => {
                                            const s = submissions.find(x => x.subCriterion === sub);
                                            let indicator = 'bg-surfaceHover border border-white/10';
                                            let shadow = '';
                                            if(s) {
                                                if(s.status==='verified') { indicator = 'bg-green-500'; shadow = 'shadow-[0_0_10px_rgba(16,185,129,0.5)]'; }
                                                else if(s.status==='submitted') { indicator = 'bg-yellow-500'; shadow = 'shadow-[0_0_10px_rgba(234,179,8,0.5)]'; }
                                                else if(s.status==='needs_revision') { indicator = 'bg-red-500'; shadow = 'shadow-[0_0_10px_rgba(239,68,68,0.5)]'; }
                                            }
                                            return (
                                                <button 
                                                    key={sub}
                                                    onClick={() => setActiveSub(sub)}
                                                    className={`w-full text-left py-2.5 text-sm flex items-center transition-colors ${activeSub === sub ? 'text-primary-400 font-semibold' : 'text-gray-500 hover:text-gray-300'}`}
                                                >
                                                    <span className={`w-2 h-2 rounded-full mr-3 flex-shrink-0 ${indicator} ${shadow}`}></span>
                                                    Sub {sub}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Content Area */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex-1 min-w-0"
                >
                    {!currentSub ? (
                        <div className="glass-panel rounded-2xl p-10 text-center text-gray-500 border-dashed border-2 border-white/10">
                            Teacher has not submitted data for this section yet.
                        </div>
                    ) : (
                        <>
                            <div className="glass-panel rounded-2xl p-6 mb-6">
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                                    <h3 className="text-xl font-bold text-white">Form Data: {activeSub}</h3>
                                    <div className="flex items-center space-x-4">
                                        {currentSub.status === 'verified' && (
                                            <div className="flex space-x-2">
                                                <button onClick={() => handleSingleDownload('pdf')} className="text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 px-2 py-1 rounded transition-colors border border-green-500/30">
                                                    Download PDF
                                                </button>
                                                <button onClick={() => handleSingleDownload('excel')} className="text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 px-2 py-1 rounded transition-colors border border-green-500/30">
                                                    Download Excel
                                                </button>
                                            </div>
                                        )}
                                        <span className={`px-3 py-1 rounded-md text-xs font-semibold tracking-wide ${
                                            currentSub.status === 'verified' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                            currentSub.status === 'needs_revision' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                            'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                        }`}>
                                            {currentSub.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Form in Readonly mode */}
                                <div className="pointer-events-none opacity-80">
                                    {FormComponent && <FormComponent initialData={currentSub.formData} disabled={true} onSave={()=>{}} onSubmit={()=>{}} />}
                                </div>
                            </div>

                            <div className="glass-panel rounded-2xl p-6 mb-6">
                                <h3 className="text-lg font-bold text-white mb-4">Supporting Documents</h3>
                                <FileList documents={currentDocs} readonly={true} />
                            </div>

                            {/* Verification Controls */}
                            <div className="glass-panel rounded-2xl p-6 sticky bottom-6 z-10 border-primary-500/30 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                <h3 className="text-lg font-bold text-white mb-4">HOD Actions</h3>
                                
                                {currentSub.hodComment && (
                                    <div className="mb-4 p-4 bg-surfaceHover border border-white/10 rounded-lg text-sm text-gray-300">
                                        <strong className="text-white">Previous Comment:</strong> {currentSub.hodComment}
                                    </div>
                                )}

                                {showCommentBox && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mb-4"
                                    >
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Enter reason for revision..."
                                            className="w-full glass-input"
                                            rows="3"
                                        ></textarea>
                                    </motion.div>
                                )}

                                <div className="flex flex-wrap gap-3">
                                    <button 
                                        onClick={() => handleVerify('verified')}
                                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                                    >
                                        Mark Verified
                                    </button>
                                    {showCommentBox ? (
                                        <>
                                            <button 
                                                onClick={() => handleVerify('needs_revision')}
                                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                                            >
                                                Submit Revision Request
                                            </button>
                                            <button 
                                                onClick={() => setShowCommentBox(false)}
                                                className="px-4 py-2 bg-surfaceHover text-gray-300 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            onClick={() => setShowCommentBox(true)}
                                            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:shadow-[0_0_20px_rgba(234,179,8,0.5)]"
                                        >
                                            Request Revision
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default HODTeacherView;
