import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { LoginView } from './components/LoginView';
import { AdminPanel } from './components/AdminPanel';
import { ProjectorView } from './components/ProjectorView';
import { TeamPortal } from './components/TeamPortal';

// Connect to Socket.io backend
// Dynamically resolve port: local server defaults to port 3001, otherwise uses window host
const socketUrl = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001' 
  : window.location.origin.replace(/(:\d+)?$/, ':3001'); // fallback or same origin

const socket = io(socketUrl, {
  transports: ['websocket', 'polling']
});

export const App: React.FC = () => {
  const [role, setRole] = useState<'login' | 'admin' | 'projector' | 'team'>('login');
  const [refId, setRefId] = useState('');
  
  // Real-time synced states
  const [teams, setTeams] = useState<any[]>([]);
  const [catalogue, setCatalogue] = useState<any[]>([]);
  const [activeItem, setActiveItem] = useState<any>(null);

  // Load persistent role session
  useEffect(() => {
    const savedRole = localStorage.getItem('ca_auction_role');
    const savedRefId = localStorage.getItem('ca_auction_refId');
    if (savedRole) {
      setRole(savedRole as any);
      if (savedRefId) setRefId(savedRefId);
    }
  }, []);

  // Listen to server updates
  useEffect(() => {
    const handleStateUpdate = (data: any) => {
      if (data.teams) setTeams(data.teams);
      if (data.catalogue) setCatalogue(data.catalogue);
      setActiveItem(data.activeItem);
    };

    socket.on('state_update', handleStateUpdate);
    return () => {
      socket.off('state_update', handleStateUpdate);
    };
  }, []);

  const handleLogin = (selectedRole: 'admin' | 'projector' | 'team', selectedRefId?: string) => {
    localStorage.setItem('ca_auction_role', selectedRole);
    setRole(selectedRole);
    
    if (selectedRole === 'team' && selectedRefId) {
      localStorage.setItem('ca_auction_refId', selectedRefId);
      setRefId(selectedRefId);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ca_auction_role');
    localStorage.removeItem('ca_auction_refId');
    setRole('login');
    setRefId('');
  };

  return (
    <>
      {role === 'login' && (
        <LoginView teams={teams} onLogin={handleLogin} />
      )}
      {role === 'admin' && (
        <AdminPanel
          socket={socket}
          teams={teams}
          catalogue={catalogue}
          activeItem={activeItem}
          onLogout={handleLogout}
        />
      )}
      {role === 'projector' && (
        <ProjectorView
          socket={socket}
          teams={teams}
          catalogue={catalogue}
          activeItem={activeItem}
          onLogout={handleLogout}
        />
      )}
      {role === 'team' && (
        <TeamPortal
          socket={socket}
          refId={refId}
          teams={teams}
          activeItem={activeItem}
          onLogout={handleLogout}
        />
      )}
    </>
  );
};
export default App;
