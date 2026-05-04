// TeacherDashboard.jsx (Clean SaaS UI Version)

import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import CriterionCard from "../components/CriterionCard";
import LoadingSpinner from "../components/LoadingSpinner";
import {
    RadialBarChart,
    RadialBar,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
import { Download } from "lucide-react";

const criteriaList = [
    { id: 1, title: "Curricular Aspects", marks: 100 },
    { id: 2, title: "Teaching-Learning", marks: 350 },
    { id: 3, title: "Research & Innovation", marks: 120 },
    { id: 4, title: "Infrastructure", marks: 100 },
    { id: 5, title: "Student Support", marks: 130 },
    { id: 6, title: "Governance", marks: 100 },
    { id: 7, title: "Best Practices", marks: 100 },
];

const TeacherDashboard = () => {
    const { user } = useAuth();
    const [progress, setProgress] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const res = await axiosInstance.get("/criteria/progress");
                setProgress(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProgress();
    }, []);

    const handleDownload = async (type) => {
        try {
            const userId = user.id || user._id;
            if (!userId) {
                console.error("User ID not found");
                return;
            }
            const res = await axiosInstance.get(`/export/${type}/${userId}`, {
                responseType: "blob",
            });
            const blob = new Blob([res.data]);
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `NAAC_${type}_${new Date().getTime()}.${type === "pdf" ? "pdf" : "xlsx"}`;
            link.click();
        } catch (err) {
            console.error("Download failed:", err);
            
            // If the response is a blob, we need to read it as text to see the error message
            if (err.response?.data instanceof Blob) {
                const reader = new FileReader();
                reader.onload = () => {
                    const errorData = JSON.parse(reader.result);
                    alert(`Download failed: ${errorData.message || "Server error"}`);
                };
                reader.readAsText(err.response.data);
            } else {
                const message = err.response?.data?.message || "An error occurred during download";
                alert(message);
            }
        }
    };

    if (loading) return <LoadingSpinner />;

    // CALCULATIONS
    let totalVer = 0,
        totalSub = 0,
        totalFields = 70;

    Object.values(progress).forEach((p) => {
        totalVer += p.verified;
        totalSub += p.submitted;
    });

    const percent = ((totalVer + totalSub) / totalFields) * 100;

    const radialData = [
        { name: "Completed", value: percent },
        { name: "Remaining", value: 100 - percent },
    ];

    const barData = [1, 2, 3, 4, 5, 6, 7].map((i) => {
        const p = progress[i] || { verified: 0, submitted: 0 };
        return {
            name: `C${i}`,
            completed: p.verified + p.submitted,
        };
    });

    return (
        <div className="max-w-7xl mx-auto px-6 py-6 space-y-8 bg-gray-50 min-h-screen">

            {/* HEADER */}
            <div className="flex justify-between items-center bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Welcome, {user.name}
                    </h1>
                    <p className="text-sm text-gray-500">
                        Track your NAAC documentation progress
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => handleDownload("pdf")}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                    >
                        PDF
                    </button>

                    <button
                        onClick={() => handleDownload("excel")}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                    >
                        Excel
                    </button>
                </div>
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT PANEL */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col gap-6">

                    {/* PROGRESS */}
                    <div className="text-center">
                        <h3 className="text-sm text-gray-500 mb-2">Overall Progress</h3>

                        <div className="h-[200px]">
                            <ResponsiveContainer>
                                <RadialBarChart
                                    innerRadius="70%"
                                    outerRadius="100%"
                                    data={radialData}
                                >
                                    <RadialBar dataKey="value" fill="#6366F1" />
                                </RadialBarChart>
                            </ResponsiveContainer>
                        </div>

                        <p className="text-3xl font-semibold text-gray-900 mt-2">
                            {percent.toFixed(0)}%
                        </p>
                    </div>

                    {/* BAR CHART */}
                    <div>
                        <h3 className="text-sm text-gray-500 mb-2">
                            Criteria Completion
                        </h3>

                        <div className="h-[200px]">
                            <ResponsiveContainer>
                                <BarChart data={barData}>
                                    <CartesianGrid stroke="#E5E7EB" />
                                    <XAxis dataKey="name" stroke="#6B7280" />
                                    <YAxis stroke="#6B7280" />
                                    <Tooltip />
                                    <Bar dataKey="completed" fill="#6366F1" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* RIGHT GRID */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {criteriaList.map((c) => (
                        <div
                            key={c.id}
                            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
                        >
                            <CriterionCard
                                criterion={c.id}
                                title={c.title}
                                marks={c.marks}
                                progressData={progress[c.id]}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;