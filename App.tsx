
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import { Trophy, Swords, Calendar, Users, Plus, Target, Flame, ChevronRight, Activity, Menu, X, Info, User as UserIcon, LogIn, Lock, Unlock, Clock, IndianRupee, Medal, Save, Crown, Camera, UserPlus, Users2, Cloud, AlertTriangle, ExternalLink, Database, CheckCircle } from 'lucide-react';
import { Tournament, CreateTournamentDTO, Participant, User, GameFormat, Team } from './types';
import { generateTournamentHype, generateTournamentRules } from './services/geminiService';
import { storageService } from './services/storageService';

// --- COMPONENTS ---

const Navbar = ({ user, onLogout }: { user: User | null, onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-tr from-cyan-500 to-fuchsia-500 p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <Trophy className="text-white h-6 w-6" />
          </div>
          <span className="font-rajdhani text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            TORVIX <span className="text-cyan-400">ARENA</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link to="/" className="text-slate-300 hover:text-white transition-colors">Find Matches</Link>
          <Link to="/host" className="text-slate-300 hover:text-white transition-colors">Host</Link>
          
          {user ? (
             <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full transition-colors border border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                    {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" /> : user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-bold text-slate-200">{user.name}</span>
                </Link>
                <button onClick={onLogout} className="text-xs text-rose-400 hover:text-rose-300 font-bold uppercase tracking-wider">Logout</button>
             </div>
          ) : (
            <Link to="/login" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2 rounded-full font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <LogIn size={18} /> Login
            </Link>
          )}
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-slate-300">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-slate-800 p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-xl">Find Matches</Link>
          <Link to="/host" onClick={() => setIsOpen(false)} className="text-xl">Host Tournament</Link>
          {user ? (
            <>
              <Link to="/profile" onClick={() => setIsOpen(false)} className="text-xl text-cyan-400">My Profile</Link>
              <button onClick={() => { onLogout(); setIsOpen(false); }} className="text-xl text-rose-500 text-left">Logout</button>
            </>
          ) : (
             <Link to="/login" onClick={() => setIsOpen(false)} className="text-xl text-cyan-400">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

const TournamentCard: React.FC<{ tournament: Tournament }> = ({ tournament }) => {
  const isLive = tournament.status === 'LIVE';
  return (
    <Link to={`/tournament/${tournament.id}`} className="group relative block bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/50 transition-all hover:translate-y-[-4px]">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-fuchsia-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative">
        <div className="flex justify-between items-start mb-4">
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${isLive ? 'bg-rose-500/10 text-rose-500' : 'bg-cyan-500/10 text-cyan-500'}`}>
            {isLive ? '• LIVE NOW' : tournament.status}
          </div>
          <span className="text-slate-500 text-xs font-mono">{tournament.startDate} • {tournament.startTime}</span>
        </div>
        <h3 className="font-rajdhani text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors truncate">{tournament.title}</h3>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">{tournament.gameName}</span>
          <span className="text-xs font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">{tournament.format}</span>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800/50">
          <div className="flex flex-col">
             <span className="text-slate-500 text-[10px] uppercase tracking-wider font-bold">Prize Pool</span>
             <span className="text-amber-400 font-bold font-rajdhani text-lg">{tournament.prizes.first}</span>
          </div>
           <div className="flex flex-col items-end">
             <span className="text-slate-500 text-[10px] uppercase tracking-wider font-bold">Entry</span>
             <span className="text-cyan-400 font-bold font-rajdhani text-lg">{tournament.entryFee > 0 ? `₹${tournament.entryFee}` : 'Free'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const LoginPage = ({ onLogin }: { onLogin: (email: string) => void }) => {
  const [email, setEmail] = useState('');
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 p-8 rounded-3xl">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-cyan-500/10 mb-4">
            <LogIn className="text-cyan-400 w-8 h-8" />
          </div>
          <h2 className="text-3xl font-rajdhani font-bold">Welcome Back</h2>
          <p className="text-slate-400">Enter your email to access Torvix Arena</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if(email) onLogin(email); }} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-cyan-500 outline-none transition-colors"
              placeholder="player@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all">
            Login / Register
          </button>
        </form>
      </div>
    </div>
  );
};

const ProfilePage = ({ user, onUpdate }: { user: User, onUpdate: (u: User) => void }) => {
  const [formData, setFormData] = useState(user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onUpdate(formData); };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-12">
      <h1 className="text-3xl font-rajdhani font-bold mb-8">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-6">
        <div className="flex flex-col items-center mb-6">
          <div onClick={() => fileInputRef.current?.click()} className="w-32 h-32 rounded-full bg-slate-800 border-2 border-cyan-500 flex items-center justify-center text-4xl font-bold text-slate-500 overflow-hidden cursor-pointer hover:opacity-80 transition-all relative group">
             {formData.avatar ? <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <span>{formData.name.charAt(0)}</span>}
             <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera className="text-white w-8 h-8" /></div>
          </div>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-4 text-sm text-cyan-400 font-bold hover:text-cyan-300">Change Profile Picture</button>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
        </div>
        <div>
           <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Display Name</label>
           <input required className="input-field" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
        </div>
        <div>
           <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Bio</label>
           <textarea rows={3} className="input-field" placeholder="Tell us about your gaming journey..." value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} />
        </div>
        <button type="submit" className="w-full bg-cyan-500 text-slate-950 font-bold py-3 rounded-xl hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2"><Save size={18} /> Save Profile</button>
      </form>
    </div>
  );
};

const HomePage = ({ tournaments }: { tournaments: Tournament[] }) => {
  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto">
      <section className="mb-20 text-center relative">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full -z-10"></div>
        <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700 px-4 py-1.5 rounded-full text-xs font-bold text-cyan-400 mb-6 tracking-widest uppercase"><Flame size={14} /> India's Premier Gaming Hub</div>
        <h1 className="text-5xl md:text-7xl font-bold font-rajdhani mb-6 leading-tight">COMPETE. WIN. <br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400">EARN GLORY</span></h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">Host and join local tournaments. From BGMI squads to Cricket teams. Automated room management and real rewards.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/host" className="w-full sm:w-auto bg-white text-slate-950 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all text-lg">Host Tournament <ChevronRight size={20} /></Link>
          <a href="#browse" className="w-full sm:w-auto bg-slate-800/50 hover:bg-slate-800 text-white border border-slate-700 px-8 py-4 rounded-xl font-bold transition-all text-lg flex items-center justify-center">Browse Matches</a>
        </div>
      </section>
      <section id="browse">
        <div className="flex items-center justify-between mb-8"><h2 className="text-3xl font-rajdhani font-bold flex items-center gap-3"><Target className="text-fuchsia-500" /> Active Tournaments</h2></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.length > 0 ? tournaments.map(t => <TournamentCard key={t.id} tournament={t} />) : <div className="col-span-full py-20 text-center border border-slate-800 border-dashed rounded-3xl text-slate-500">No tournaments found. Be the first to host one!</div>}
          <Link to="/host" className="group border-2 border-dashed border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:border-slate-600 transition-colors text-slate-500 hover:text-slate-400 min-h-[300px]">
            <div className="bg-slate-900 p-4 rounded-full group-hover:scale-110 transition-transform"><Plus size={32} /></div>
            <span className="font-bold">Create New Room</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

const HostTournamentPage = ({ onAdd }: { onAdd: (dto: CreateTournamentDTO) => void }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateTournamentDTO>({
    title: '', description: '', type: 'ESPORTS', gameName: '', format: 'SOLO', startDate: '', startTime: '', maxParticipants: 100, entryFee: 0, prizes: { first: '', second: '', third: '' }
  });

  const handleAiAssist = async () => {
    if (!formData.title || !formData.gameName) return alert("Title and game name required!");
    setLoading(true);
    try {
      const hype = await generateTournamentHype(formData.title, formData.gameName, formData.prizes.first || "Huge Rewards");
      setFormData(prev => ({ ...prev, description: hype || prev.description }));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto">
      <div className="mb-10 text-center"><h1 className="text-4xl font-rajdhani font-bold mb-4">Host Tournament</h1><p className="text-slate-400">Set up your room, define prizes, and let the battle begin.</p></div>
      <form onSubmit={(e) => { e.preventDefault(); onAdd(formData); navigate('/'); }} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-8">
        <section className="space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">Details</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <input required className="input-field" placeholder="Tournament Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <input required className="input-field" placeholder="Game Name" value={formData.gameName} onChange={e => setFormData({...formData, gameName: e.target.value})} />
          </div>
          <div className="space-y-2">
             <div className="flex justify-between items-center"><label className="text-xs font-bold text-slate-400 uppercase">Description</label><button type="button" disabled={loading} onClick={handleAiAssist} className="text-xs font-bold text-fuchsia-400 bg-fuchsia-500/10 px-2 py-1 rounded">AI Assist</button></div>
             <textarea rows={3} className="input-field" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
        </section>
        <section className="space-y-6">
           <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">Format & Schedule</h3>
           <div className="grid md:grid-cols-3 gap-6">
              <select className="input-field" value={formData.format} onChange={e => setFormData({...formData, format: e.target.value as GameFormat})}>
                <option value="SOLO">Solo</option><option value="DUO">Duo</option><option value="SQUAD">Squad</option>
              </select>
              <input type="date" required className="input-field" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
              <input type="time" required className="input-field" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
           </div>
           <div className="grid md:grid-cols-2 gap-6">
              <input type="number" className="input-field" placeholder="Max Slots" value={formData.maxParticipants} onChange={e => setFormData({...formData, maxParticipants: parseInt(e.target.value)})} />
              <input type="number" className="input-field" placeholder="Entry Fee (₹)" value={formData.entryFee} onChange={e => setFormData({...formData, entryFee: parseInt(e.target.value)})} />
           </div>
        </section>
        <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white font-bold py-4 rounded-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all text-lg mt-8">Launch Tournament</button>
      </form>
    </div>
  );
};

const TournamentDetailPage = ({ tournaments, currentUser, onJoin, onUpdateRoom, onAnnounceWinner, onCreateTeam, onJoinTeam }: any) => {
  const { id } = useParams();
  const tournament = tournaments.find((t: any) => t.id === id);
  const [activeTab, setActiveTab] = useState<'info' | 'room' | 'players' | 'teams'>('info');
  const [roomForm, setRoomForm] = useState({ id: '', pass: '' });
  const [teamNameForm, setTeamNameForm] = useState('');
  const [showTeamModal, setShowTeamModal] = useState(false);

  useEffect(() => { if (tournament) setRoomForm({ id: tournament.roomId || '', pass: tournament.roomPassword || '' }); }, [tournament]);
  if (!tournament) return <div className="p-20 text-center text-slate-500">Tournament not found</div>;

  const isHost = currentUser && currentUser.id === tournament.hostId;
  const isJoined = currentUser && (tournament.participants.some((p: any) => p.userId === currentUser.id) || tournament.teams?.some((t: any) => t.members.includes(currentUser.id)));
  const canViewRoom = isHost || isJoined;
  const teamSizeLimit = tournament.format === 'DUO' ? 2 : tournament.format === 'SQUAD' ? 4 : 1;

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto">
      <div className="relative mb-8 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 min-h-[250px] flex flex-col justify-end p-8">
        <img src={`https://picsum.photos/seed/${tournament.id}/1200/400`} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Banner" />
        <div className="relative z-20">
          <div className="flex gap-2 mb-4">
             <span className="badge bg-cyan-500 text-black">{tournament.status}</span>
             <span className="badge bg-slate-800 border border-slate-600">{tournament.gameName}</span>
             <span className="badge bg-slate-800 border border-slate-600">{tournament.format}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-rajdhani mb-2 drop-shadow-md">{tournament.title}</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {tournament.winner && (
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 p-6 rounded-2xl flex items-center gap-6">
               <div className="bg-amber-500 w-16 h-16 rounded-full flex items-center justify-center text-slate-950"><Crown size={32} fill="currentColor" /></div>
               <div><div className="text-amber-400 font-bold uppercase tracking-widest text-sm mb-1">Champion</div><div className="text-3xl font-rajdhani font-bold text-white">{tournament.winner.name}</div></div>
            </div>
          )}

          <div className="flex border-b border-slate-800 gap-8 overflow-x-auto whitespace-nowrap">
             {['info', 'room', 'players', 'teams'].map(tab => (
               <button key={tab} onClick={() => setActiveTab(tab as any)} className={`pb-4 text-sm font-bold uppercase tracking-widest relative ${activeTab === tab ? 'text-cyan-400' : 'text-slate-500'}`}>
                 {tab === 'info' ? 'Details' : tab === 'room' ? 'Room Info' : tab === 'players' ? 'Participants' : 'Teams'}
                 {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400"></div>}
               </button>
             ))}
          </div>

          {activeTab === 'info' && (
             <div className="space-y-8">
                <div className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800/50"><h3 className="section-title mb-4">Description</h3><p className="text-slate-400 leading-relaxed">{tournament.description}</p></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="prize-card border-amber-500/30 bg-amber-500/5"><div className="text-amber-500 font-bold mb-1">1st Place</div><div className="text-2xl font-rajdhani font-bold text-white">{tournament.prizes.first}</div></div>
                   <div className="prize-card border-slate-600/30 bg-slate-600/5"><div className="text-slate-400 font-bold mb-1">2nd Place</div><div className="text-xl font-rajdhani font-bold text-white">{tournament.prizes.second}</div></div>
                   <div className="prize-card border-slate-700/30 bg-slate-700/5"><div className="text-slate-500 font-bold mb-1">3rd Place</div><div className="text-lg font-rajdhani font-bold text-white">{tournament.prizes.third}</div></div>
                </div>
                {isHost && !tournament.winner && (
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                     <h3 className="section-title mb-4 text-cyan-400">Host Actions</h3>
                     <select id="winSel" className="input-field max-w-xs mb-4">{tournament.participants.map((p: any) => <option key={p.userId} value={p.userId}>{p.name}</option>)}</select>
                     <button onClick={() => { const s = document.getElementById('winSel') as HTMLSelectElement; onAnnounceWinner(tournament.id, s.value); }} className="block bg-cyan-500 text-slate-950 px-6 py-2 rounded-lg font-bold">Declare Winner</button>
                  </div>
                )}
             </div>
          )}

          {activeTab === 'room' && (
             <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
                {!canViewRoom ? <><Lock size={48} className="text-slate-700 mb-4" /><h3 className="text-xl font-bold">Restricted Access</h3><p className="text-slate-400">Join to view credentials.</p></> : 
                <div className="w-full max-w-md space-y-6">
                   <div className="bg-slate-950 p-6 rounded-xl border border-cyan-500/20 text-left">
                      <div className="flex justify-between border-b border-slate-800 pb-2 mb-4"><span>ID</span><span className="font-mono font-bold text-xl">{tournament.roomId || 'TBD'}</span></div>
                      <div className="flex justify-between border-b border-slate-800 pb-2"><span>Pass</span><span className="font-mono font-bold text-xl">{tournament.roomPassword || '---'}</span></div>
                   </div>
                   {isHost && <div className="space-y-4"><input className="input-field" placeholder="New ID" value={roomForm.id} onChange={e => setRoomForm({...roomForm, id: e.target.value})} /><input className="input-field" placeholder="New Pass" value={roomForm.pass} onChange={e => setRoomForm({...roomForm, pass: e.target.value})} /><button onClick={() => onUpdateRoom(tournament.id, roomForm.id, roomForm.pass)} className="w-full bg-slate-800 py-2 rounded-lg font-bold">Save</button></div>}
                </div>}
             </div>
          )}

          {activeTab === 'players' && (
             <div className="grid md:grid-cols-2 gap-4">
                {tournament.participants.map((p: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">{p.avatar ? <img src={p.avatar} className="w-full h-full object-cover" /> : p.name.charAt(0)}</div>
                    <div><span className="font-bold">{p.name}</span>{p.teamName && <div className="text-[10px] text-cyan-500 font-bold">{p.teamName}</div>}</div>
                  </div>
                ))}
             </div>
          )}

          {activeTab === 'teams' && (
             <div className="grid md:grid-cols-2 gap-6">
                {tournament.teams?.map((team: any) => (
                   <div key={team.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                      <div className="flex justify-between items-center mb-4"><h4>{team.name}</h4><span>{team.members.length}/{teamSizeLimit}</span></div>
                      <div className="space-y-2">{team.members.map((m: any, i: number) => <div key={i} className="text-sm">{tournament.participants.find((p:any) => p.userId === m)?.name}</div>)}</div>
                      {currentUser && !isJoined && team.members.length < teamSizeLimit && <button onClick={() => onJoinTeam(tournament.id, team.id)} className="w-full mt-4 bg-slate-800 py-2 rounded-lg">Join Team</button>}
                   </div>
                ))}
             </div>
          )}
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-28">
              <div className="space-y-4 mb-8 text-sm">
                 <div className="flex justify-between"><span>Date</span><span className="font-bold">{tournament.startDate}</span></div>
                 <div className="flex justify-between"><span>Entry</span><span className="font-bold text-cyan-400">{tournament.entryFee > 0 ? `₹${tournament.entryFee}` : 'Free'}</span></div>
              </div>
              {isJoined ? <button disabled className="w-full bg-emerald-500/20 text-emerald-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2"><CheckCircle size={18} /> Registered</button> : 
                <div className="space-y-4">
                  {tournament.format === 'SOLO' ? <button onClick={() => onJoin(tournament.id)} className="w-full py-4 rounded-xl font-bold bg-white text-slate-950">Join Match</button> : <button onClick={() => setShowTeamModal(true)} className="w-full py-4 bg-cyan-500 text-slate-950 rounded-xl font-bold">Create Team</button>}
                </div>
              }
           </div>
        </div>
      </div>

      {showTeamModal && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-md">
               <div className="flex justify-between mb-6"><h3>Register Team</h3><button onClick={() => setShowTeamModal(false)}><X /></button></div>
               <input className="input-field mb-6" placeholder="Team Name" value={teamNameForm} onChange={e => setTeamNameForm(e.target.value)} />
               <button onClick={() => { onJoin(tournament.id); onCreateTeam(tournament.id, teamNameForm); setShowTeamModal(false); }} className="w-full bg-cyan-500 text-slate-950 font-bold py-4 rounded-xl">Confirm</button>
            </div>
         </div>
      )}
    </div>
  );
};

const App = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('torvix_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const unsub = storageService.subscribeToTournaments(setTournaments);
    return unsub;
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('torvix_current_user', JSON.stringify(currentUser));
      storageService.saveUser(currentUser);
    } else {
      localStorage.removeItem('torvix_current_user');
    }
  }, [currentUser]);

  const handleLogin = async (email: string) => {
    const userId = email.replace(/\./g, '_');
    const existing = await storageService.getUser(userId);
    if (existing) setCurrentUser(existing);
    else {
      const newUser: User = { id: userId, email, name: email.split('@')[0], bio: 'Gamer', avatar: '', joinedAt: new Date().toISOString() };
      await storageService.saveUser(newUser);
      setCurrentUser(newUser);
    }
  };

  const handleAddTournament = (dto: CreateTournamentDTO) => {
    if (!currentUser) return;
    const t: Tournament = { ...dto, id: Math.random().toString(36).substr(2, 9), hostId: currentUser.id, participants: [], teams: [], status: 'UPCOMING', winner: null, createdAt: new Date().toISOString() };
    storageService.createTournament(t);
  };

  const handleJoinTournament = (tournamentId: string) => {
    if (!currentUser) return;
    const p: Participant = { userId: currentUser.id, name: currentUser.name, avatar: currentUser.avatar, registeredAt: new Date().toISOString() };
    storageService.joinTournamentParticipant(tournamentId, p);
  };

  const handleCreateTeam = (tournamentId: string, teamName: string) => {
    if (!currentUser) return;
    const t = tournaments.find(x => x.id === tournamentId);
    if (!t) return;
    const newTeam: Team = { id: Math.random().toString(36).substr(2, 9), name: teamName, captainId: currentUser.id, members: [currentUser.id], tournamentId };
    storageService.updateTournament(tournamentId, { teams: [...(t.teams || []), newTeam] });
  };

  const handleJoinTeam = (tournamentId: string, teamId: string) => {
    if (!currentUser) return;
    const t = tournaments.find(x => x.id === tournamentId);
    if (!t) return;
    const updatedTeams = t.teams.map(team => team.id === teamId ? { ...team, members: [...team.members, currentUser.id] } : team);
    storageService.updateTournament(tournamentId, { teams: updatedTeams });
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200 font-inter">
        <style>{`
          .input-field { width: 100%; background-color: #020617; border: 1px solid #1e293b; border-radius: 0.75rem; padding: 0.75rem 1rem; outline: none; transition: border-color 0.2s; }
          .input-field:focus { border-color: #06b6d4; }
          .section-title { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 1.25rem; color: white; }
          .badge { font-size: 0.65rem; font-weight: 800; padding: 0.25rem 0.5rem; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em; }
          .prize-card { border: 1px solid; border-radius: 1rem; padding: 1rem; text-align: center; }
        `}</style>
        <Navbar user={currentUser} onLogout={() => setCurrentUser(null)} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage tournaments={tournaments} />} />
            <Route path="/login" element={currentUser ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/profile" element={currentUser ? <ProfilePage user={currentUser} onUpdate={setCurrentUser} /> : <Navigate to="/login" />} />
            <Route path="/host" element={currentUser ? <HostTournamentPage onAdd={handleAddTournament} /> : <Navigate to="/login" />} />
            <Route path="/tournament/:id" element={<TournamentDetailPage tournaments={tournaments} currentUser={currentUser} onJoin={handleJoinTournament} onUpdateRoom={(id: string, rid: string, rps: string) => storageService.updateTournament(id, { roomId: rid, roomPassword: rps })} onAnnounceWinner={(id: string, uid: string) => storageService.updateTournament(id, { status: 'COMPLETED', winner: tournaments.find(tx => tx.id === id)?.participants.find(px => px.userId === uid) })} onCreateTeam={handleCreateTeam} onJoinTeam={handleJoinTeam} />} />
          </Routes>
        </main>
        <footer className="border-t border-slate-900 py-8 px-6 text-center text-xs text-slate-600">
           <div className="flex items-center justify-center gap-4 mb-2"><Cloud size={14} className="text-emerald-500" /> LOCAL STORAGE ACTIVE</div>
           © 2024 TORVIX ARENA | NO CLOUD REQUIRED
        </footer>
      </div>
    </Router>
  );
};

export default App;
