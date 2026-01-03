
import React from 'react';
import { Match, Participant } from '../types';

interface BracketViewProps {
  matches: Match[];
  participants: Participant[];
  onMatchClick?: (match: Match) => void;
}

const BracketView: React.FC<BracketViewProps> = ({ matches, participants, onMatchClick }) => {
  const roundsCount = Math.max(...matches.map(m => m.round), 0);
  const rounds = Array.from({ length: roundsCount }, (_, i) => i + 1);

  // Fix: changed 'p.id' to 'p.userId' to match the Participant interface in types.ts
  const getParticipantName = (id: string | null) => {
    if (!id) return "TBD";
    return participants.find(p => p.userId === id)?.name || "Unknown";
  };

  return (
    <div className="flex overflow-x-auto gap-12 py-8 px-4 scrollbar-hide">
      {rounds.map((round) => (
        <div key={round} className="flex flex-col justify-around gap-8 min-w-[250px]">
          <h3 className="text-slate-400 font-rajdhani uppercase tracking-widest text-sm mb-4 border-b border-slate-800 pb-2">
            Round {round}
          </h3>
          {matches
            .filter((m) => m.round === round)
            .sort((a, b) => a.position - b.position)
            .map((match) => (
              <div
                key={match.id}
                onClick={() => onMatchClick?.(match)}
                className={`group relative p-3 rounded-lg border transition-all cursor-pointer ${
                  match.status === 'LIVE' 
                    ? 'border-cyan-500 bg-cyan-950/20' 
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-600'
                }`}
              >
                {match.status === 'LIVE' && (
                  <span className="absolute -top-2 -right-2 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                  </span>
                )}
                <div className="flex flex-col gap-2">
                  <div className={`flex justify-between items-center ${match.winnerId === match.p1Id && match.p1Id ? 'text-cyan-400 font-bold' : 'text-slate-300'}`}>
                    <span className="truncate w-32">{getParticipantName(match.p1Id)}</span>
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-xs">{match.p1Score ?? '-'}</span>
                  </div>
                  <div className="h-[1px] bg-slate-800 w-full"></div>
                  <div className={`flex justify-between items-center ${match.winnerId === match.p2Id && match.p2Id ? 'text-cyan-400 font-bold' : 'text-slate-300'}`}>
                    <span className="truncate w-32">{getParticipantName(match.p2Id)}</span>
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-xs">{match.p2Score ?? '-'}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default BracketView;
