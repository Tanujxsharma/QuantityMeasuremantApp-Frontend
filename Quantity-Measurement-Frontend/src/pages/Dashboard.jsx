import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [compareData, setCompareData] = useState({
    v1: "",
    u1: "FEET",
    v2: "",
    u2: "INCHES",
    type: "LengthUnit",
    operation: "COMPARE"
  });

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const unitOptions = {
    LengthUnit: ["FEET", "INCHES", "CENTIMETERS", "YARDS"],
    WeightUnit: ["KILOGRAM", "GRAM", "POUND", "TONNE", "MILLIGRAM"],
    VolumeUnit: ["LITRE", "MILLILITRE", "GALLON"],
    TemperatureUnit: ["CELSIUS", "FAHRENHEIT", "KELVIN"]
  };

  const handleChange = (e) => {
    setCompareData({
      ...compareData,
      [e.target.name]: e.target.value
    });
  };

  const handleTypeChange = (newType) => {
    setCompareData({
      ...compareData,
      type: newType,
      u1: unitOptions[newType][0],
      u2: unitOptions[newType][1] || unitOptions[newType][0]
    });
  };

  const handleOperationChange = (op) => {
    setCompareData({
      ...compareData,
      operation: op
    });
  };

  const performOperation = async () => {
    if (!compareData.v1 || (compareData.operation === 'COMPARE' && !compareData.v2)) {
      alert("Please enter values");
      return;
    }

    setIsLoading(true);
    try {
      const res = await API.post("/api/measurements/" + compareData.operation.toLowerCase(), {
        thisQuantity: {
          value: parseFloat(compareData.v1),
          unit: compareData.u1,
          measurementType: compareData.type
        },
        thatQuantity: {
          value: parseFloat(compareData.v2 || 0),
          unit: compareData.u2,
          measurementType: compareData.type
        }
      });

      setResult(res.data);
    } catch {
      setResult({ error: true });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const measurementIcons = {
    LengthUnit: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    WeightUnit: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    VolumeUnit: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    TemperatureUnit: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  };

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

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/history")}
            className="btn-outline flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            History
          </button>

          <button
            onClick={logout}
            className="btn-secondary flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </nav>

      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-secondary-900">Measurement Converter</h1>
          <p className="text-secondary-500">Easily compare and convert between different units of measurement.</p>
        </div>

        {/* Type Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(unitOptions).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                compareData.type === type
                  ? "border-primary-600 bg-primary-50 text-primary-700 shadow-md"
                  : "border-secondary-100 bg-white text-secondary-500 hover:border-primary-200 hover:bg-slate-50"
              }`}
            >
              <div className={`${compareData.type === type ? "text-primary-600" : "text-secondary-400"}`}>
                {measurementIcons[type]}
              </div>
              <span className="font-semibold text-sm">{type.replace("Unit", "")}</span>
            </button>
          ))}
        </div>

        {/* Main Work Area */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Inputs Section */}
          <div className="md:col-span-2 space-y-6">
            <div className="card space-y-6">
              <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
                {["COMPARE", "ADD", "SUBTRACT", "DIVIDE", "CONVERT"].map((op) => (
                  <button
                    key={op}
                    onClick={() => handleOperationChange(op)}
                    className={`flex-1 min-w-[90px] py-2 px-3 rounded-lg font-medium transition-all text-sm ${
                      compareData.operation === op ? "bg-white shadow text-primary-600" : "text-secondary-500 hover:text-secondary-700"
                    }`}
                  >
                    {op.charAt(0) + op.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-secondary-700">Quantity 1</label>
                  <div className="flex gap-2">
                    <input
                      name="v1"
                      type="number"
                      placeholder="Value"
                      value={compareData.v1}
                      onChange={handleChange}
                      className="input-field flex-1"
                    />
                    <select
                        name="u1"
                        value={compareData.u1}
                        onChange={handleChange}
                        className="input-field w-32"
                      >
                        {unitOptions[compareData.type].map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={`space-y-2 transition-opacity duration-300 ${compareData.operation === 'CONVERT' ? 'opacity-50' : 'opacity-100'}`}>
                    <label className="text-sm font-semibold text-secondary-700">
                      {compareData.operation === 'CONVERT' ? 'Target Unit' : 'Quantity 2'}
                    </label>
                    <div className="flex gap-2">
                      {compareData.operation !== 'CONVERT' && (
                        <input
                          name="v2"
                          type="number"
                          placeholder="Value"
                          value={compareData.v2}
                          onChange={handleChange}
                          className="input-field flex-1"
                        />
                      )}
                      <select
                        name="u2"
                        value={compareData.u2}
                        onChange={handleChange}
                        className={`input-field ${compareData.operation === 'CONVERT' ? 'w-full' : 'w-32'}`}
                      >
                        {unitOptions[compareData.type].map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                  </div>
                </div>
              </div>

              <button
                onClick={performOperation}
                disabled={isLoading}
                className={`w-full btn-primary py-4 text-lg shadow-xl shadow-primary-500/20 flex items-center justify-center gap-2 ${isLoading ? 'opacity-70' : ''}`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Calculate Result
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className={`card h-full flex flex-col items-center justify-center text-center p-8 transition-all duration-500 ${result ? 'bg-primary-600 text-white' : 'bg-white text-secondary-400'}`}>
              {!result ? (
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-secondary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="font-medium">Enter values and click calculate to see result</p>
                </div>
              ) : result.error ? (
                <div className="space-y-4 text-white">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Calculation Error</h3>
                  <p className="opacity-90">Please check your inputs and try again.</p>
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in text-white">
                  <span className="text-sm font-bold uppercase tracking-widest opacity-80">Result</span>
                  <div className="text-3xl font-black uppercase">
                    {compareData.operation === 'COMPARE' 
                      ? (result.resultString?.toUpperCase() === 'EQUAL' ? 'EQUAL' : 'NOT EQUAL')
                      : (result.resultString || (typeof result === 'object' && result !== null && result.resultValue !== undefined 
                          ? `${result.resultValue} ${result.resultUnit || ''}` 
                          : JSON.stringify(result)))}
                  </div>
                  <div className="w-12 h-1 bg-white/30 mx-auto rounded-full"></div>
                  <p className="text-lg opacity-90">
                    {compareData.operation === 'COMPARE' 
                      ? `${compareData.v1} ${compareData.u1} is ${result.resultString?.toLowerCase() === 'equal' ? '' : 'not'} equal to ${compareData.v2} ${compareData.u2}`
                      : compareData.operation === 'CONVERT'
                        ? `${compareData.v1} ${compareData.u1} converted to ${compareData.u2}`
                        : `Result of ${compareData.operation.toLowerCase()} operation`
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}