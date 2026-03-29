[3/29/2026 2:17 AM] Eph: import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { Send, ClipboardList, CheckCircle, Clock, User, Phone, FileText } from 'lucide-react';

// Firebase configuration - ይህ በሲስተሙ በራሱ የሚሞላ ነው
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const appId = typeof app_id !== 'undefined' ? app_id : 'bole-edu-v1';

const App = () => {
  const [view, setView] = useState('submit');
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form001, setForm001] = useState({
    fullName: '', phone: '', subject: '', woreda: '', houseNo: '', status: 'በተጠባባቂ'
  });

  const [form002, setForm002] = useState({ findings: '', decision: '', officerName: '' });

  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (err) {
        console.error("Auth error", err);
      }
    };
    initAuth();

    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'complaints'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComplaints(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.error("Snapshot error", error));

    return () => unsubscribe();
  }, []);

  const handleSubmit001 = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'complaints'), {
        ...form001,
        createdAt: new Date().toISOString()
      });
      alert("ቅሬታዎ በቁጥር 001 መሠረት በስኬት ተመዝግቧል!");
      setForm001({ fullName: '', phone: '', subject: '', woreda: '', houseNo: '', status: 'በተጠባባቂ' });
    } catch (err) {
      alert("ስህተት ተፈጥሯል");
    }
    setLoading(false);
  };

  const handleUpdate002 = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'complaints', selectedComplaint.id);
      await updateDoc(docRef, {
        response: { ...form002, updatedAt: new Date().toISOString() },
        status: 'ተጠናቋል'
      });
      alert("ምላሹ በቁጥር 002 መሠረት ተመዝግቧል!");
      setSelectedComplaint(null);
    } catch (err) {
      alert("ምላሹን መመዝገብ አልተቻለም");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      <header className="bg-blue-900 text-white p-6 shadow-xl text-center border-b-4 border-yellow-500 sticky top-0 z-50">
        <h1 className="text-xl font-black uppercase tracking-tight">ቦሌ ክፍለ ከተማ ትምህርት ጽ/ቤት</h1>
        <p className="text-[10px] mt-1 opacity-80 font-bold uppercase tracking-widest text-yellow-400">የቅሬታ መቀበያና መከታተያ ሲስተም</p>
        
        <div className="flex justify-center mt-6 bg-white/10 p-1 rounded-2xl w-fit mx-auto backdrop-blur-md">
          <button 
            onClick={() => setView('submit')} 
            className={px-6 py-2 rounded-xl text-xs font-black transition-all ${view === 'submit' ? 'bg-white text-blue-900 shadow-lg' : 'text-white hover:bg-white/5'}}
          >
            ቅሬታ አቅርብ (001)
          </button>
          <button 
            onClick={() => setView('admin')} 
            className={px-6 py-2 rounded-xl text-xs font-black transition-all ${view === 'admin' ? 'bg-white text-blue-900 shadow-lg' : 'text-white hover:bg-white/5'}}
          >
            ዳሽቦርድ (ለኮሚቴ)
          </button>
        </div>
      </header>
[3/29/2026 2:17 AM] Eph: <main className="max-w-4xl mx-auto p-4 md:p-8">
        {view === 'submit' ? (
          <div className="bg-white rounded-[2rem] shadow-2xl p-6 md:p-10 border border-slate-200">
            <div className="flex items-center gap-3 mb-8 border-b pb-4">
              <div className="bg-blue-100 p-3 rounded-2xl text-blue-600"><ClipboardList size={24}/></div>
              <div>
                <h2 className="text-lg font-black text-blue-900 uppercase">የቅሬታ ማቅረቢያ ቅጽ 001</h2>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest italic tracking-tighter">የቦሌ ክፍለ ከተማ ትምህርት ጽ/ቤት</p>
              </div>
            </div>

            <form onSubmit={handleSubmit001} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><User size={12}/> ሙሉ ስም</label>
                  <input placeholder="የቅሬታ አቅራቢ ስም" required className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-blue-500 shadow-sm transition-all" onChange={e => setForm001({...form001, fullName: e.target.value})} value={form001.fullName} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><Phone size={12}/> ስልክ ቁጥር</label>
                  <input placeholder="09..." required className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-blue-500 shadow-sm transition-all" onChange={e => setForm001({...form001, phone: e.target.value})} value={form001.phone} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><FileText size={12}/> የቅሬታው ዝርዝር</label>
                <textarea placeholder="ቅሬታዎን እዚህ ጋር ይግለጹ..." required className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-3xl outline-none focus:border-blue-500 shadow-sm h-40 transition-all" onChange={e => setForm001({...form001, subject: e.target.value})} value={form001.subject} />
              </div>

              <button disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                {loading ? "በመመዝገብ ላይ..." : <><Send size={20} /> ቅሬታውን መዝግብ (001)</>}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-blue-600 p-6 rounded-3xl shadow-lg text-white">
                <ClipboardList size={20} className="mb-2 opacity-50"/>
                <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">ጠቅላላ</p>
                <h3 className="text-2xl font-black">{complaints.length}</h3>
              </div>
              <div className="bg-amber-500 p-6 rounded-3xl shadow-lg text-white">
                <Clock size={20} className="mb-2 opacity-50"/>
                <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">በጥበቃ</p>
                <h3 className="text-2xl font-black">{complaints.filter(c => c.status === 'በተጠባባቂ').length}</h3>
              </div>
              <div className="bg-emerald-600 p-6 rounded-3xl shadow-lg text-white col-span-2 md:col-span-1">
                <CheckCircle size={20} className="mb-2 opacity-50"/>
                <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">ተጠናቋል</p>
                <h3 className="text-2xl font-black">{complaints.filter(c => c.status === 'ተጠናቋል').length}</h3>
              </div>
            </div>
[3/29/2026 2:17 AM] Eph: <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-200">
              <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
                <h2 className="font-black text-blue-900 uppercase text-xs tracking-wider">የቅሬታዎች ዝርዝር</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] text-slate-400 uppercase font-black border-b tracking-widest">
                      <th className="p-6">ባለጉዳይ</th>
                      <th className="p-6">ሁኔታ</th>
                      <th className="p-6 text-right">ድርጊት</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {complaints.map(c => (
                      <tr key={c.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="p-6 font-bold text-slate-700">{c.fullName}</td>
                        <td className="p-6">
                          <span className={px-3 py-1 rounded-full text-[9px] font-black uppercase ${c.status === 'ተጠናቋል' ? 'bg-emerald-100 text-emerald-700 shadow-sm border border-emerald-200' : 'bg-amber-100 text-amber-700 shadow-sm border border-amber-200'}}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          <button onClick={() => setSelectedComplaint(c)} className="bg-white border-2 border-blue-100 text-blue-600 px-5 py-2 rounded-xl text-[10px] font-black hover:bg-blue-600 hover:text-white transition-all shadow-sm">ምላሽ ስጥ</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {selectedComplaint && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative border border-slate-100">
            <button onClick={() => setSelectedComplaint(null)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 font-bold p-2 text-xl">×</button>
            <h2 className="text-lg font-black text-blue-900 mb-6 uppercase underline decoration-yellow-500 decoration-4 underline-offset-8 text-center">ምላሽ መስጫ ቅጽ (002)</h2>
            
            <div className="bg-blue-50 p-5 rounded-3xl mb-6 border border-blue-100">
              <p className="text-[10px] font-black text-blue-400 uppercase mb-1">ባለጉዳይ፡ {selectedComplaint.fullName}</p>
              <p className="text-xs text-blue-900 mt-2 font-medium italic overflow-hidden h-10 leading-tight">" {selectedComplaint.subject} "</p>
            </div>

            <form onSubmit={handleUpdate002} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">የምርመራ ግኝት</label>
                <textarea required className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl h-24 outline-none focus:border-blue-500 shadow-sm" placeholder="ውጤቱን እዚህ ጋር ይግለጹ..." onChange={e => setForm002({...form002, findings: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">ውሳኔ</label>
                <select required className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-xs font-bold shadow-sm" onChange={e => setForm002({...form002, decision: e.target.value})}>
[3/29/2026 2:17 AM] Eph: <option value="">ውሳኔ ይምረጡ</option>
                  <option value="ቅሬታው ተገቢ ነው">ቅሬታው ተገቢ ነው</option>
                  <option value="ቅሬታው ተገቢ አይደለም">ቅሬታው ተገቢ አይደለም</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">ምላሽ የሰጠው ሀላፊ</label>
                <input placeholder="የሀላፊ ስም" required className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl shadow-sm" onChange={e => setForm002({...form002, officerName: e.target.value})} />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setSelectedComplaint(null)} className="flex-1 bg-slate-100 py-4 rounded-2xl font-black text-slate-500 hover:bg-slate-200 transition-all">ተው</button>
                <button type="submit" disabled={loading} className="flex-[2] bg-green-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-green-700 transition-all">
                  {loading ? "በማጽደቅ ላይ..." : "ምላሹን አጽድቅ (002)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
