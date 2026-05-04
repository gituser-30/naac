// HODDashboard.jsx
import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import AuditLogTable from "../components/AuditLogTable";
import {
    Download,
    Users,
    FileCheck,
    FileClock,
    AlertCircle,
    Eye,
    Bell,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const HODDashboard = () => {
    const [teachers, setTeachers] = useState([]);
    const [pendingTeachers, setPendingTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("teachers");
    const [filter, setFilter] = useState("all");
    const navigate = useNavigate();

    const fetchTeachers = async () => {
        try {
            const res = await axiosInstance.get("/hod/teachers");
            setTeachers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchPending = async () => {
        try {
            const res = await axiosInstance.get("/hod/pending-teachers");
            setPendingTeachers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await Promise.all([fetchTeachers(), fetchPending()]);
            setLoading(false);
        };
        load();
    }, []);

    const handleVerifyTeacher = async (uid) => {
        const password = window.prompt("Set initial password for this teacher (min 6 chars):");
        if (!password || password.length < 6) return toast.error("Valid password required");

        try {
            await axiosInstance.post(`/hod/verify-teacher/${uid}`, { password });
            toast.success("Teacher verified and credentials sent!");
            fetchTeachers();
            fetchPending();
        } catch (err) {
            toast.error("Verification failed");
        }
    };

    const handleDownloadConsolidated = async () => {
        try {
            const res = await axiosInstance.get("/export/consolidated", {
                responseType: "blob",
            });
            const blob = new Blob([res.data]);
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = `NAAC_Consolidated_${Date.now()}.xlsx`;
            link.click();
        } catch (err) {
            toast.error("Download failed");
        }
    };

    const handleRemind = async (uid) => {
        const msg = window.prompt("Enter reminder message:");
        if (!msg) return;
        await axiosInstance.post(`/hod/notify/${uid}`, { message: msg });
        toast.success("Reminder sent");
    };

    const toggleTeacherStatus = async (uid) => {
        await axiosInstance.patch(`/hod/teacher/${uid}/toggle`);
        fetchTeachers();
    };

    if (loading) return <LoadingSpinner />;

    // Stats Calculations
    const totalTeachers = teachers.length;
    const verifiedTeachers = teachers.filter(t => Object.values(t.progress || {}).includes("verified"));
    const revisionTeachers = teachers.filter(t => Object.values(t.progress || {}).includes("needs_revision"));
    const pendingTeachersCount = pendingTeachers.length;

    const totalVerified = verifiedTeachers.length;
    const totalNeedsRev = revisionTeachers.length;

    const criteriaData = [1, 2, 3, 4, 5, 6, 7].map((c) => ({
        name: `C${c}`,
        verified: 0,
        submitted: 0,
        revision: 0,
    }));

    teachers.forEach((t) => {
        [1, 2, 3, 4, 5, 6, 7].forEach((c, i) => {
            const status = t.progress[`c${c}`];
            if (status === "verified") criteriaData[i].verified++;
            else if (status === "submitted") criteriaData[i].submitted++;
            else if (status === "needs_revision")
                criteriaData[i].revision++;
        });
    });

    // Filtering logic for the list
    const filteredTeachers = teachers.filter(t => {
        if (filter === "all") return true;
        const vals = Object.values(t.progress || {});
        if (filter === "verified") return vals.includes("verified");
        if (filter === "revision") return vals.includes("needs_revision");
        if (filter === "pending") return !vals.includes("verified") && !vals.includes("needs_revision") && vals.includes("submitted");
        return true;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 bg-gray-50 min-h-screen">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        HOD Dashboard
                    </h1>
                    <p className="text-sm text-gray-500">
                        Department overview & NAAC tracking
                    </p>
                </div>

                <button
                    onClick={handleDownloadConsolidated}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    <Download className="w-4 h-4" />
                    Export Overall Excel
                </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    icon={<Users />} 
                    label="Teachers" 
                    value={totalTeachers} 
                    color="indigo" 
                    onClick={() => { setFilter("all"); setActiveTab("teachers"); }}
                    active={filter === "all" && activeTab === "teachers"}
                />
                <StatCard 
                    icon={<FileCheck />} 
                    label="Verified" 
                    value={totalVerified} 
                    color="green" 
                    onClick={() => { setFilter("verified"); setActiveTab("teachers"); }}
                    active={filter === "verified" && activeTab === "teachers"}
                />
                <StatCard 
                    icon={<Bell />} 
                    label="Requests" 
                    value={pendingTeachersCount} 
                    color="indigo" 
                    onClick={() => setActiveTab("requests")}
                    active={activeTab === "requests"}
                />
                <StatCard 
                    icon={<AlertCircle />} 
                    label="Revision" 
                    value={totalNeedsRev} 
                    color="red" 
                    onClick={() => { setFilter("revision"); setActiveTab("teachers"); }}
                    active={filter === "revision" && activeTab === "teachers"}
                />
            </div>

            {/* CHART */}
            <div className="bg-white border border-gray-200 p-4 sm:p-6 rounded-xl shadow-sm h-[350px] sm:h-[400px]">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Department Progress
                </h3>

                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={criteriaData}>
                        <CartesianGrid stroke="#E5E7EB" vertical={false} />
                        <XAxis dataKey="name" stroke="#6B7280" axisLine={false} tickLine={false} />
                        <YAxis stroke="#6B7280" axisLine={false} tickLine={false} />
                        <Tooltip
                            cursor={{ fill: '#F3F4F6' }}
                            contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #E5E7EB",
                                borderRadius: '8px'
                            }}
                        />
                        <Legend iconType="circle" />
                        <Bar dataKey="verified" fill="#22C55E" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="submitted" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="revision" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* TABS */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab("teachers")}
                    className={`px-4 py-2 rounded-md text-sm transition ${activeTab === "teachers"
                            ? "bg-white shadow text-gray-900"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Teachers
                </button>

                <button
                    onClick={() => setActiveTab("requests")}
                    className={`px-4 py-2 rounded-md text-sm transition relative ${activeTab === "requests"
                            ? "bg-white shadow text-gray-900"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Requests
                    {pendingTeachersCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    )}
                </button>

                <button
                    onClick={() => setActiveTab("audit")}
                    className={`px-4 py-2 rounded-md text-sm transition ${activeTab === "audit"
                            ? "bg-white shadow text-gray-900"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Audit Log
                </button>
            </div>

            {/* TEACHER LIST TABLE */}
            {activeTab === "teachers" && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900 capitalize">
                            {filter} List
                        </h2>
                        <span className="text-sm text-gray-500">
                            Showing {filteredTeachers.length} results
                        </span>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold">Teacher</th>
                                    {[1, 2, 3, 4, 5, 6, 7].map((c) => (
                                        <th key={c} className="px-2 py-4 text-center font-semibold">C{c}</th>
                                    ))}
                                    <th className="text-right px-6 py-4 font-semibold">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 bg-white">
                                {filteredTeachers.map((t) => (
                                    <tr key={t._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs mr-3">
                                                    {t.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{t.name}</p>
                                                    <p className="text-xs text-gray-500">{t.department}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {[1, 2, 3, 4, 5, 6, 7].map((i) => {
                                            const status = t.progress[`c${i}`];
                                            let color = "bg-gray-200";

                                            if (status === "verified") color = "bg-green-500";
                                            if (status === "submitted") color = "bg-yellow-500";
                                            if (status === "needs_revision") color = "bg-red-500";

                                            return (
                                                <td key={i} className="px-2 py-4 text-center">
                                                    <div 
                                                        className={`w-2.5 h-2.5 mx-auto rounded-full ${color} shadow-sm`} 
                                                        title={status || 'Not started'}
                                                    />
                                                </td>
                                            );
                                        })}

                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => navigate(`/hod/teacher/${t._id}`)}
                                                    className="p-1.5 hover:bg-indigo-50 rounded-lg transition"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-5 h-5 text-gray-500 hover:text-indigo-600" />
                                                </button>

                                                <button 
                                                    onClick={() => handleRemind(t._id)}
                                                    className="p-1.5 hover:bg-yellow-50 rounded-lg transition"
                                                    title="Send Reminder"
                                                >
                                                    <Bell className="w-5 h-5 text-gray-500 hover:text-yellow-600" />
                                                </button>

                                                <button
                                                    onClick={() => toggleTeacherStatus(t._id)}
                                                    className={`text-[10px] uppercase font-bold px-2 py-1 rounded transition ${t.isActive
                                                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                                                            : "bg-green-50 text-green-600 hover:bg-green-100"
                                                        }`}
                                                >
                                                    {t.isActive ? "Disable" : "Enable"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* REQUESTS TABLE */}
            {activeTab === "requests" && (
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">New Registration Requests</h2>
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-4 text-left">Teacher Info</th>
                                    <th className="px-6 py-4 text-left">Department</th>
                                    <th className="px-6 py-4 text-left">Registered At</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {pendingTeachers.map(t => (
                                    <tr key={t._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-900">{t.name}</p>
                                            <p className="text-xs text-gray-500">{t.email}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {t.department}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(t.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleVerifyTeacher(t._id)}
                                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
                                            >
                                                Verify & Send Password
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {pendingTeachers.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                            No pending registration requests.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === "audit" && (
                <div className="bg-white border border-gray-200 p-4 sm:p-6 rounded-xl shadow-sm overflow-x-auto">
                    <AuditLogTable />
                </div>
            )}
        </div>
    );
};

export default HODDashboard;


// STAT CARD COMPONENT
const StatCard = ({ icon, label, value, color, onClick, active }) => {
    const colors = {
        indigo: "bg-indigo-100 text-indigo-600 border-indigo-200",
        green: "bg-green-100 text-green-600 border-green-200",
        yellow: "bg-yellow-100 text-yellow-600 border-yellow-200",
        red: "bg-red-100 text-red-600 border-red-200",
    };

    const activeColors = {
        indigo: "border-indigo-600 ring-2 ring-indigo-100 shadow-md",
        green: "border-green-600 ring-2 ring-green-100 shadow-md",
        yellow: "border-yellow-600 ring-2 ring-yellow-100 shadow-md",
        red: "border-red-600 ring-2 ring-red-100 shadow-md",
    };

    return (
        <button 
            onClick={onClick}
            className={`w-full text-left bg-white border rounded-xl p-5 flex items-center transition-all duration-200 hover:scale-[1.02] ${
                active ? activeColors[color] : "border-gray-200 hover:border-gray-300 shadow-sm"
            }`}
        >
            <div className={`p-3 rounded-lg mr-4 ${colors[color]} border`}>
                {icon}
            </div>
            <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
            </div>
        </button>
    );
};