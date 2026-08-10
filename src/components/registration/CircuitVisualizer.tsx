import React, { useEffect, useRef, useState } from 'react';
import type { Participant } from '../../types/arena';
import { Cpu, Terminal } from 'lucide-react';

interface CircuitVisualizerProps {
  teamName: string;
  teamSize: number;
  participants: Participant[];
  step: number;
  agreed?: boolean;
}

export const CircuitVisualizer: React.FC<CircuitVisualizerProps> = ({
  teamName,
  teamSize,
  participants,
  step,
  agreed = false
}) => {
  const [logs, setLogs] = useState<string[]>([]);
  const consoleEndRef = useRef<HTMLDivElement>(null);
  
  // Track previous state for logging
  const prevTeamNameRef = useRef(teamName);
  const prevTeamSizeRef = useRef(teamSize);
  const prevStepRef = useRef(step);
  const prevAgreedRef = useRef(agreed);
  const prevParticipantsRef = useRef<string[]>([]);

  // Initial logs
  useEffect(() => {
    setLogs([
      `[SYS_OK] Initializing Circuit Diagnostics Interface...`,
      `[SYS_OK] System Version 2.6.0-stable`,
      `[CORES] Core processor allocation: STANDBY`,
      `[VOLT] Voltage set: 5.0V (Standard impedance mode)`
    ]);
  }, []);

  // Live telemetry logger
  useEffect(() => {
    const newLogs: string[] = [];
    const timestamp = () => {
      const now = new Date();
      return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${(now.getMilliseconds() / 10).toFixed(0).padStart(2, '0')}`;
    };

    if (teamName !== prevTeamNameRef.current) {
      if (teamName.trim()) {
        newLogs.push(`[${timestamp()}] [CORE_LINK] Core Roster ID registered: "${teamName.toUpperCase()}"`);
      } else {
        newLogs.push(`[${timestamp()}] [CORE_LINK] Core Roster ID cleared: STANDBY`);
      }
      prevTeamNameRef.current = teamName;
    }

    if (teamSize !== prevTeamSizeRef.current) {
      newLogs.push(`[${timestamp()}] [ALLOC] System requested ports reallocated: ${teamSize} active`);
      prevTeamSizeRef.current = teamSize;
    }

    if (step !== prevStepRef.current) {
      newLogs.push(`[${timestamp()}] [SYS_FLOW] Wizard path transitioned to Stage 0${step}`);
      prevStepRef.current = step;
    }

    if (agreed !== prevAgreedRef.current) {
      if (agreed) {
        newLogs.push(`[${timestamp()}] [SAFETY] Directives approved. Logic switch: CLOSED`);
      } else {
        newLogs.push(`[${timestamp()}] [SAFETY] Logic switch: OPEN (Security lock active)`);
      }
      prevAgreedRef.current = agreed;
    }

    // Check individual participant completions
    participants.slice(0, teamSize).forEach((p, idx) => {
      const prevName = prevParticipantsRef.current[idx] || '';
      if (p.name !== prevName) {
        if (p.name.trim()) {
          newLogs.push(`[${timestamp()}] [NODE_CONN] Port ${idx + 1} connected to user "${p.name.toUpperCase()}"`);
        } else if (prevName) {
          newLogs.push(`[${timestamp()}] [NODE_CONN] Port ${idx + 1} lost carrier signal`);
        }
      }
    });
    
    prevParticipantsRef.current = participants.map(p => p.name);

    if (newLogs.length > 0) {
      setLogs(prev => [...prev, ...newLogs].slice(-40)); // Keep last 40 logs
    }
  }, [teamName, teamSize, step, agreed, participants]);

  // Scroll to bottom of terminal
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Check if a node is complete (needs Name and Email)
  const isNodeComplete = (idx: number) => {
    const p = participants[idx];
    return p && p.name.trim() !== '' && p.email.trim() !== '';
  };

  // Check how many nodes are complete out of team size
  const completedNodesCount = participants
    .slice(0, teamSize)
    .filter((_, idx) => isNodeComplete(idx)).length;

  const stabilityPercentage = Math.round(
    (completedNodesCount / teamSize) * 70 + (teamName.trim() ? 20 : 0) + (agreed ? 10 : 0)
  );

  return (
    <div className="flex flex-col h-full bg-[#0e111a] border border-slate-800 rounded-2xl overflow-hidden hud-box">
      
      {/* Visualizer Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#07080c] border-b border-slate-800">
        <div className="flex items-center gap-2 text-left">
          <Cpu className="w-4 h-4 text-[#ff6b00] animate-pulse" />
          <span className="font-mono text-xs font-bold text-white tracking-widest uppercase">
            LIVE TELEMETRY DIAGNOSTICS
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-mono text-[9px] text-emerald-400">ONLINE</span>
        </div>
      </div>

      {/* SVG Board Area */}
      <div className="relative flex-grow flex items-center justify-center p-6 bg-[#07080c] bg-cyber-grid min-h-[350px] lg:min-h-[420px]">
        
        {/* Real-time Status Overlay */}
        <div className="absolute top-4 left-4 font-mono text-[10px] space-y-1 bg-slate-950/80 p-2.5 rounded border border-slate-800 backdrop-blur z-10 text-left">
          <div>IMPD_LOCK: <span className="text-[#00f0ff] font-bold">120 Ohm</span></div>
          <div>POWER_LVL: <span className="text-[#00ff66] font-bold">5.00V</span></div>
          <div>STABILITY: <span className={`${stabilityPercentage > 50 ? 'text-[#00ff66]' : stabilityPercentage > 20 ? 'text-amber-400' : 'text-red-400'} font-bold`}>{stabilityPercentage}%</span></div>
        </div>

        {/* SVG Canvas */}
        <svg
          viewBox="0 0 400 420"
          className="w-full h-full max-w-[340px] lg:max-w-full drop-shadow-[0_0_15px_rgba(255,107,0,0.05)]"
        >
          {/* Gradients and Filters Definition */}
          <defs>
            <filter id="circuit-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            <linearGradient id="active-orange" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff9f43" />
              <stop offset="100%" stopColor="#ff6b00" />
            </linearGradient>

            <linearGradient id="active-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="100%" stopColor="#70a1ff" />
            </linearGradient>

            <linearGradient id="active-green" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2ed573" />
              <stop offset="100%" stopColor="#00ff66" />
            </linearGradient>
          </defs>

          {/* SVG Glow Filters & Background Traces */}
          <g stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3">
            <line x1="200" y1="20" x2="200" y2="400" />
            <line x1="20" y1="210" x2="380" y2="210" />
          </g>

          {/* -------------------- DYNAMIC TRACE LINES (ELECTRONS FLOWING) -------------------- */}
          {/* Path 1: Core -> Leader Node (Left Top) */}
          <path
            id="path-leader"
            d="M 200 130 L 100 130 L 100 90"
            fill="none"
            stroke={teamName.trim() ? "#ff6b00" : "#1e293b"}
            strokeWidth="2"
            className="transition-colors duration-500"
          />
          {teamName.trim() && (
            <path
              d="M 200 130 L 100 130 L 100 90"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="2.5"
              strokeDasharray="8, 12"
              className="animate-[dash_2.5s_linear_infinite]"
              filter="url(#circuit-glow)"
            />
          )}

          {/* Path 2: Core -> Node 2 (Right Top) */}
          {teamSize >= 2 && (
            <>
              <path
                id="path-member2"
                d="M 200 130 L 300 130 L 300 90"
                fill="none"
                stroke={isNodeComplete(0) ? "#00f0ff" : "#1e293b"}
                strokeWidth="2"
                className="transition-colors duration-500"
              />
              {isNodeComplete(0) && (
                <path
                  d="M 200 130 L 300 130 L 300 90"
                  fill="none"
                  stroke="#ff6b00"
                  strokeWidth="2.5"
                  strokeDasharray="8, 12"
                  className="animate-[dash_2.5s_linear_infinite]"
                  filter="url(#circuit-glow)"
                />
              )}
            </>
          )}

          {/* Path 3: Core -> Node 3 (Left Bottom) */}
          {teamSize >= 3 && (
            <>
              <path
                id="path-member3"
                d="M 200 190 L 100 190 L 100 240"
                fill="none"
                stroke={isNodeComplete(0) ? "#00f0ff" : "#1e293b"}
                strokeWidth="2"
                className="transition-colors duration-500"
              />
              {isNodeComplete(0) && (
                <path
                  d="M 200 190 L 100 190 L 100 240"
                  fill="none"
                  stroke="#00ff66"
                  strokeWidth="2.5"
                  strokeDasharray="8, 12"
                  className="animate-[dash_2.5s_linear_infinite]"
                  filter="url(#circuit-glow)"
                />
              )}
            </>
          )}

          {/* Path 4: Core -> Node 4 (Right Bottom) */}
          {teamSize >= 4 && (
            <>
              <path
                id="path-member4"
                d="M 200 190 L 300 190 L 300 240"
                fill="none"
                stroke={isNodeComplete(0) ? "#00f0ff" : "#1e293b"}
                strokeWidth="2"
                className="transition-colors duration-500"
              />
              {isNodeComplete(0) && (
                <path
                  d="M 200 190 L 300 190 L 300 240"
                  fill="none"
                  stroke="#ff6b00"
                  strokeWidth="2.5"
                  strokeDasharray="8, 12"
                  className="animate-[dash_2.5s_linear_infinite]"
                  filter="url(#circuit-glow)"
                />
              )}
            </>
          )}

          {/* Path 5: Core -> Switch -> Telemetry Node */}
          <path
            d="M 200 210 L 200 310"
            fill="none"
            stroke={completedNodesCount === teamSize ? "#00ff66" : "#1e293b"}
            strokeWidth="2.5"
            className="transition-colors duration-500"
          />
          {completedNodesCount === teamSize && (
            <path
              d="M 200 210 L 200 310"
              fill="none"
              stroke="#00ff66"
              strokeWidth="3"
              strokeDasharray="10, 15"
              className="animate-[dash_1.5s_linear_infinite]"
              filter="url(#circuit-glow)"
            />
          )}

          {/* -------------------- CENTRAL CORE CPU -------------------- */}
          <g transform="translate(140, 120)">
            {/* CPU Pins */}
            {[-1, 0, 1].map((i) => (
              <g key={i}>
                {/* Left pins */}
                <line x1="-12" y1={40 + i * 20} x2="0" y2={40 + i * 20} stroke="#475569" strokeWidth="3" />
                {/* Right pins */}
                <line x1="120" y1={40 + i * 20} x2="132" y2={40 + i * 20} stroke="#475569" strokeWidth="3" />
                {/* Top pins */}
                <line x1={40 + i * 20} y1="-12" x2={40 + i * 20} y2="0" stroke="#475569" strokeWidth="3" />
                {/* Bottom pins */}
                <line x1={40 + i * 20} y1="80" x2={40 + i * 20} y2="92" stroke="#475569" strokeWidth="3" />
              </g>
            ))}

            {/* Microchip Body */}
            <rect
              x="0"
              y="0"
              width="120"
              height="80"
              rx="8"
              fill="#0f172a"
              stroke={teamName.trim() ? "#ff6b00" : "#334155"}
              strokeWidth="3"
              className="transition-colors duration-500 shadow-2xl"
              filter={teamName.trim() ? "url(#circuit-glow)" : ""}
            />

            {/* Core Label */}
            <text
              x="60"
              y="32"
              fill="#94a3b8"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              ROSTER_CORE
            </text>

            <text
              x="60"
              y="52"
              fill={teamName.trim() ? "#ffffff" : "#64748b"}
              fontSize="11"
              fontFamily="Orbitron, Chakra Petch, monospace"
              fontWeight="black"
              textAnchor="middle"
              className="tracking-wider"
            >
              {teamName.trim()
                ? teamName.toUpperCase().slice(0, 10) + (teamName.length > 10 ? '..' : '')
                : 'STANDBY'}
            </text>

            {/* Core Status indicator dot */}
            <circle
              cx="60"
              cy="65"
              r="3.5"
              fill={teamName.trim() ? "#ff6b00" : "#475569"}
              className={teamName.trim() ? "animate-pulse" : ""}
            />
          </g>

          {/* -------------------- PARTICIPANT NODES -------------------- */}

          {/* Participant 1: Leader (Left Top) */}
          <g transform="translate(40, 30)">
            <rect
              x="0"
              y="0"
              width="120"
              height="60"
              rx="6"
              fill="#090d16"
              stroke={isNodeComplete(0) ? "#00ff66" : "#475569"}
              strokeWidth="2"
              className="transition-all duration-500"
              filter={isNodeComplete(0) ? "url(#circuit-glow)" : ""}
            />
            <text x="10" y="18" fill="#ff6b00" fontSize="8" fontFamily="monospace" fontWeight="bold">
              P1 // LEADER
            </text>
            <text x="10" y="34" fill={isNodeComplete(0) ? "#ffffff" : "#64748b"} fontSize="9" fontFamily="monospace" fontWeight="bold">
              {participants[0]?.name ? participants[0].name.toUpperCase().slice(0, 14) : 'VACANT_PORT'}
            </text>
            <text x="10" y="48" fill={isNodeComplete(0) ? "#00ff66" : "#f43f5e"} fontSize="8" fontFamily="monospace">
              {isNodeComplete(0) ? '● ONLINE' : '○ OFFLINE'}
            </text>
          </g>

          {/* Participant 2: Member 2 (Right Top) */}
          {teamSize >= 2 && (
            <g transform="translate(240, 30)">
              <rect
                x="0"
                y="0"
                width="120"
                height="60"
                rx="6"
                fill="#090d16"
                stroke={isNodeComplete(1) ? "#00f0ff" : "#475569"}
                strokeWidth="2"
                className="transition-all duration-500"
                filter={isNodeComplete(1) ? "url(#circuit-glow)" : ""}
              />
              <text x="10" y="18" fill="#00f0ff" fontSize="8" fontFamily="monospace" fontWeight="bold">
                P2 // MEMBER
              </text>
              <text x="10" y="34" fill={isNodeComplete(1) ? "#ffffff" : "#64748b"} fontSize="9" fontFamily="monospace" fontWeight="bold">
                {participants[1]?.name ? participants[1].name.toUpperCase().slice(0, 14) : 'VACANT_PORT'}
              </text>
              <text x="10" y="48" fill={isNodeComplete(1) ? "#00f0ff" : "#f43f5e"} fontSize="8" fontFamily="monospace">
                {isNodeComplete(1) ? '● ONLINE' : '○ OFFLINE'}
              </text>
            </g>
          )}

          {/* Participant 3: Member 3 (Left Bottom) */}
          {teamSize >= 3 && (
            <g transform="translate(40, 240)">
              <rect
                x="0"
                y="0"
                width="120"
                height="60"
                rx="6"
                fill="#090d16"
                stroke={isNodeComplete(2) ? "#00f0ff" : "#475569"}
                strokeWidth="2"
                className="transition-all duration-500"
                filter={isNodeComplete(2) ? "url(#circuit-glow)" : ""}
              />
              <text x="10" y="18" fill="#00f0ff" fontSize="8" fontFamily="monospace" fontWeight="bold">
                P3 // MEMBER
              </text>
              <text x="10" y="34" fill={isNodeComplete(2) ? "#ffffff" : "#64748b"} fontSize="9" fontFamily="monospace" fontWeight="bold">
                {participants[2]?.name ? participants[2].name.toUpperCase().slice(0, 14) : 'VACANT_PORT'}
              </text>
              <text x="10" y="48" fill={isNodeComplete(2) ? "#00f0ff" : "#f43f5e"} fontSize="8" fontFamily="monospace">
                {isNodeComplete(2) ? '● ONLINE' : '○ OFFLINE'}
              </text>
            </g>
          )}

          {/* Participant 4: Member 4 (Right Bottom) */}
          {teamSize >= 4 && (
            <g transform="translate(240, 240)">
              <rect
                x="0"
                y="0"
                width="120"
                height="60"
                rx="6"
                fill="#090d16"
                stroke={isNodeComplete(3) ? "#00f0ff" : "#475569"}
                strokeWidth="2"
                className="transition-all duration-500"
                filter={isNodeComplete(3) ? "url(#circuit-glow)" : ""}
              />
              <text x="10" y="18" fill="#00f0ff" fontSize="8" fontFamily="monospace" fontWeight="bold">
                P4 // MEMBER
              </text>
              <text x="10" y="34" fill={isNodeComplete(3) ? "#ffffff" : "#64748b"} fontSize="9" fontFamily="monospace" fontWeight="bold">
                {participants[3]?.name ? participants[3].name.toUpperCase().slice(0, 14) : 'VACANT_PORT'}
              </text>
              <text x="10" y="48" fill={isNodeComplete(3) ? "#00f0ff" : "#f43f5e"} fontSize="8" fontFamily="monospace">
                {isNodeComplete(3) ? '● ONLINE' : '○ OFFLINE'}
              </text>
            </g>
          )}

          {/* -------------------- SAFETY GATE / SWITCH -------------------- */}
          <g transform="translate(160, 310)">
            <rect
              x="0"
              y="0"
              width="80"
              height="45"
              rx="4"
              fill="#0b0e17"
              stroke={agreed ? "#00ff66" : "#475569"}
              strokeWidth="2"
              className="transition-colors duration-500"
            />
            <text x="40" y="18" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">
              SAFETY_DIRECTIVE
            </text>
            <text
              x="40"
              y="32"
              fill={agreed ? "#00ff66" : "#ff4d6d"}
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
              className="transition-colors duration-500"
            >
              {agreed ? 'CLOSED LOOP' : 'OPEN CIRCUIT'}
            </text>
          </g>

          {/* Connection Lines from Switch to final terminal */}
          <path
            d="M 200 355 L 200 390"
            fill="none"
            stroke={agreed ? "#00ff66" : "#1e293b"}
            strokeWidth="2.5"
            className="transition-colors duration-500"
          />

          {/* Telemetry Output Terminal (LED Node at bottom) */}
          <circle
            cx="200"
            cy="390"
            r="8"
            fill={agreed && completedNodesCount === teamSize ? "#00ff66" : "#1e293b"}
            stroke={agreed && completedNodesCount === teamSize ? "#ffffff" : "#475569"}
            strokeWidth="1.5"
            className="transition-all duration-500"
            filter={agreed && completedNodesCount === teamSize ? "url(#circuit-glow)" : ""}
          />
        </svg>

        {/* CSS for path animation */}
        <style>{`
          @keyframes dash {
            to {
              stroke-dashoffset: -20;
            }
          }
        `}</style>
      </div>

      {/* Diagnostics Console panel */}
      <div className="bg-slate-950 p-4 font-mono text-[10px] text-slate-400 border-t border-slate-800 h-32 overflow-y-auto flex flex-col justify-start">
        <div className="flex items-center gap-1.5 text-slate-500 mb-2 border-b border-slate-900 pb-1">
          <Terminal className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span>ROSTER_TELEMETRY_STREAM</span>
        </div>
        <div className="space-y-1 text-left flex-1 overflow-y-auto">
          {logs.map((log, index) => {
            let textColor = 'text-slate-400';
            if (log.includes('[SYS_OK]')) textColor = 'text-slate-500';
            else if (log.includes('[SAFETY]')) textColor = 'text-amber-400';
            else if (log.includes('[CORE_LINK]')) textColor = 'text-[#ff6b00]';
            else if (log.includes('[NODE_CONN]')) textColor = 'text-[#00f0ff]';
            else if (log.includes('[ALLOC]')) textColor = 'text-purple-400';
            
            return (
              <div key={index} className={`font-mono leading-relaxed break-all ${textColor}`}>
                {log}
              </div>
            );
          })}
          <div ref={consoleEndRef} />
        </div>
      </div>
    </div>
  );
};
