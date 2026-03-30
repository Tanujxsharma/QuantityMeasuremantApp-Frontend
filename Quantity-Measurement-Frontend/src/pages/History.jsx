import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function History() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/api/measurements/history");
      setData(res.data);
    } catch {
      alert("Failed to load history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-secondary-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-secondary-900 tracking-tight">
            Quantity <span className="text-primary-600">Measurement App</span>
          </h2>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="btn-outline flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
      </nav>

      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full space-y-8 animate-fade-in">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-secondary-900">Calculation History</h1>
            <p className="text-secondary-500">View all your previous measurement comparisons and additions.</p>
          </div>
          <button 
            onClick={loadData}
            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Refresh history"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-secondary-100">
                  <th className="px-6 py-4 text-xs font-bold text-secondary-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-secondary-500 uppercase tracking-wider">First Quantity</th>
                  <th className="px-6 py-4 text-xs font-bold text-secondary-500 uppercase tracking-wider">Second Quantity</th>
                  <th className="px-6 py-4 text-xs font-bold text-secondary-500 uppercase tracking-wider">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
                    </tr>
                  ))
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-secondary-400">
                      <div className="flex flex-col items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        No history found. Start by making some calculations!
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-md bg-secondary-100 text-secondary-600 text-xs font-bold uppercase">
                          {item.measurementType?.replace("Unit", "") || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-secondary-900 font-medium">{item.thisValue}</span>
                          <span className="text-secondary-400 text-xs">{item.thisUnit}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-secondary-900 font-medium">{item.thatValue}</span>
                          <span className="text-secondary-400 text-xs">{item.thatUnit}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          item.resultString?.includes("Not Equal") 
                            ? "bg-red-50 text-red-600" 
                            : item.resultString?.includes("Equal") 
                              ? "bg-green-50 text-green-600"
                              : "bg-primary-50 text-primary-600"
                        }`}>
                          {item.resultString}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}