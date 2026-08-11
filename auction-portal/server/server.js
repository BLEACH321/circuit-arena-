const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data.json');

// Default initial catalogue
const DEFAULT_CATALOGUE = [
  { id: 'item-1', name: 'Arduino Uno R3', category: 'MICROCONTROLLER', basePrice: 300, currentBid: 300, highestBidder: null, highestBidderName: null, status: 'UNSOLD', minIncrement: 25 },
  { id: 'item-2', name: 'Servo Motor SG90', category: 'ACTUATOR', basePrice: 150, currentBid: 150, highestBidder: null, highestBidderName: null, status: 'UNSOLD', minIncrement: 25 },
  { id: 'item-3', name: 'Ultrasonic Sensor HC-SR04', category: 'SENSOR', basePrice: 100, currentBid: 100, highestBidder: null, highestBidderName: null, status: 'UNSOLD', minIncrement: 25 },
  { id: 'item-4', name: 'L298N Motor Driver', category: 'CONTROLLER', basePrice: 200, currentBid: 200, highestBidder: null, highestBidderName: null, status: 'UNSOLD', minIncrement: 25 },
  { id: 'item-5', name: '16x2 LCD Display I2C', category: 'DISPLAY', basePrice: 250, currentBid: 250, highestBidder: null, highestBidderName: null, status: 'UNSOLD', minIncrement: 25 },
  { id: 'item-6', name: '5V Single-Channel Relay', category: 'MODULE', basePrice: 120, currentBid: 120, highestBidder: null, highestBidderName: null, status: 'UNSOLD', minIncrement: 25 },
  { id: 'item-7', name: 'HC-05 Bluetooth Module', category: 'COMMUNICATION', basePrice: 350, currentBid: 350, highestBidder: null, highestBidderName: null, status: 'UNSOLD', minIncrement: 25 },
  { id: 'item-8', name: 'Breadboard Power Supply 3.3V/5V', category: 'POWER', basePrice: 100, currentBid: 100, highestBidder: null, highestBidderName: null, status: 'UNSOLD', minIncrement: 25 }
];

// App State
let state = {
  teams: [],
  catalogue: [],
  activeItem: null, // { item, timer, isRunning, bidsLog: [] }
  systemStatus: 'IDLE' // IDLE, ACTIVE, COMPLETED
};

// Helper: load state
function loadState() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      state = JSON.parse(raw);
      // Ensure structural compliance
      if (!state.teams) state.teams = [];
      if (!state.catalogue || state.catalogue.length === 0) state.catalogue = DEFAULT_CATALOGUE;
      if (!state.systemStatus) state.systemStatus = 'IDLE';
    } else {
      state.catalogue = JSON.parse(JSON.stringify(DEFAULT_CATALOGUE));
      saveState();
    }
  } catch (err) {
    console.error("Error loading state. Initializing fresh defaults...", err);
    state.catalogue = JSON.parse(JSON.stringify(DEFAULT_CATALOGUE));
  }
}

// Helper: save state
function saveState() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf8');
  } catch (err) {
    console.error("Error saving state:", err);
  }
}

loadState();

// Timer ticker variable
let timerInterval = null;

// Broadcast complete state to all clients
function broadcastState() {
  io.emit('state_update', {
    teams: state.teams,
    catalogue: state.catalogue,
    activeItem: state.activeItem,
    systemStatus: state.systemStatus
  });
}

// Socket IO Communication
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  // Send current state on connection
  socket.emit('state_update', {
    teams: state.teams,
    catalogue: state.catalogue,
    activeItem: state.activeItem,
    systemStatus: state.systemStatus
  });

  // ADMIN ACTIONS
  
  // Roster CSV upload / Set teams
  socket.on('admin_set_teams', (uploadedTeams) => {
    // uploadedTeams: Array of { refId, teamName, college, budget }
    state.teams = uploadedTeams.map(t => ({
      refId: t.refId.trim().toUpperCase(),
      teamName: t.teamName.trim(),
      college: t.college.trim(),
      budget: Number(t.budget) || 2000,
      inventory: []
    }));
    saveState();
    broadcastState();
  });

  // Update starting budget for all teams
  socket.on('admin_reset_budgets', (startingBudget) => {
    state.teams = state.teams.map(t => ({
      ...t,
      budget: Number(startingBudget) || 2000,
      inventory: []
    }));
    // Reset catalogue items status
    state.catalogue = JSON.parse(JSON.stringify(DEFAULT_CATALOGUE));
    state.activeItem = null;
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    saveState();
    broadcastState();
  });

  // Activate item for bidding
  socket.on('admin_activate_item', (itemId) => {
    const item = state.catalogue.find(i => i.id === itemId);
    if (!item || item.status === 'SOLD') return;

    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    state.activeItem = {
      item: { ...item },
      timer: 30,
      isRunning: false,
      bidsLog: []
    };
    saveState();
    broadcastState();
  });

  // Start Bidding Timer
  socket.on('admin_start_timer', () => {
    if (!state.activeItem || state.activeItem.isRunning) return;

    state.activeItem.isRunning = true;
    broadcastState();

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (state.activeItem && state.activeItem.isRunning) {
        if (state.activeItem.timer > 0) {
          state.activeItem.timer--;
          broadcastState();
        } else {
          // Timer ended! Auto sell
          clearInterval(timerInterval);
          timerInterval = null;
          state.activeItem.isRunning = false;
          handleAutoSell();
        }
      }
    }, 1000);
  });

  // Pause Bidding Timer
  socket.on('admin_pause_timer', () => {
    if (!state.activeItem || !state.activeItem.isRunning) return;
    state.activeItem.isRunning = false;
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    broadcastState();
  });

  // Reset Bidding Timer (Adds 10 seconds or resets to 30)
  socket.on('admin_reset_timer', (seconds = 30) => {
    if (!state.activeItem) return;
    state.activeItem.timer = seconds;
    broadcastState();
  });

  // Sell active item manually
  socket.on('admin_sell_item', () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    handleAutoSell();
  });

  // Mark item as Unsold / Skip
  socket.on('admin_unsold_item', () => {
    if (!state.activeItem) return;
    
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    const itemIdx = state.catalogue.findIndex(i => i.id === state.activeItem.item.id);
    if (itemIdx !== -1) {
      state.catalogue[itemIdx].status = 'UNSOLD';
      state.catalogue[itemIdx].highestBidder = null;
      state.catalogue[itemIdx].highestBidderName = null;
    }

    io.emit('auction_announcement', {
      type: 'UNSOLD',
      message: `${state.activeItem.item.name} went unsold.`
    });

    state.activeItem = null;
    saveState();
    broadcastState();
  });

  // Reset entire simulation data
  socket.on('admin_clear_all', () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    state.teams = [];
    state.catalogue = JSON.parse(JSON.stringify(DEFAULT_CATALOGUE));
    state.activeItem = null;
    state.systemStatus = 'IDLE';
    saveState();
    broadcastState();
  });

  // TEAM ACTIONS
  
  // Submit live bid from a team
  socket.on('place_bid', ({ refId }) => {
    if (!state.activeItem || !state.activeItem.isRunning) {
      socket.emit('bid_error', 'Bidding is not active right now.');
      return;
    }

    const team = state.teams.find(t => t.refId === refId.trim().toUpperCase());
    if (!team) {
      socket.emit('bid_error', 'Invalid Reference ID.');
      return;
    }

    const currentItem = state.activeItem.item;
    const bidAmount = currentItem.highestBidder
      ? currentItem.currentBid + currentItem.minIncrement
      : currentItem.basePrice;

    // Check if team has enough budget
    if (team.budget < bidAmount) {
      socket.emit('bid_error', 'INSUFFICIENT BUDGET! You cannot afford this bid.');
      return;
    }

    // Verify team is not bidding against themselves
    if (currentItem.highestBidder === team.refId) {
      socket.emit('bid_error', 'You already hold the highest bid.');
      return;
    }

    // Place bid
    state.activeItem.item.currentBid = bidAmount;
    state.activeItem.item.highestBidder = team.refId;
    state.activeItem.item.highestBidderName = team.teamName;

    // Add 5 seconds to timer if bid is placed within last 5 seconds (Anti-sniping protocol)
    if (state.activeItem.timer <= 5) {
      state.activeItem.timer = Math.min(state.activeItem.timer + 5, 10);
      io.emit('auction_announcement', {
        type: 'TIME_EXTENDED',
        message: 'Anti-sniping protocol: +5 seconds added!'
      });
    }

    // Log bid
    const timestamp = new Date().toLocaleTimeString();
    state.activeItem.bidsLog.unshift({
      time: timestamp,
      teamName: team.teamName,
      amount: bidAmount
    });

    saveState();
    broadcastState();
    io.emit('bid_success_broadcast', {
      teamName: team.teamName,
      amount: bidAmount,
      itemName: currentItem.name
    });
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Auto sell function when timer ends or manual sell is triggered
function handleAutoSell() {
  if (!state.activeItem) return;

  const { item } = state.activeItem;
  const itemIdx = state.catalogue.findIndex(i => i.id === item.id);
  
  if (itemIdx === -1) return;

  if (item.highestBidder) {
    // Sold to team
    const teamIdx = state.teams.findIndex(t => t.refId === item.highestBidder);
    if (teamIdx !== -1) {
      const buyer = state.teams[teamIdx];
      // Deduct budget
      buyer.budget -= item.currentBid;
      // Add to inventory
      buyer.inventory.push({
        id: item.id,
        name: item.name,
        category: item.category,
        purchasePrice: item.currentBid
      });

      // Update catalogue item status
      state.catalogue[itemIdx].status = 'SOLD';
      state.catalogue[itemIdx].currentBid = item.currentBid;
      state.catalogue[itemIdx].highestBidder = item.highestBidder;
      state.catalogue[itemIdx].highestBidderName = buyer.teamName;

      // Broadcast announcement
      io.emit('auction_announcement', {
        type: 'SOLD',
        message: `HAMMER DOWN! ${item.name} sold to ${buyer.teamName} for ${item.currentBid} Coins!`,
        buyerName: buyer.teamName,
        price: item.currentBid,
        itemName: item.name
      });
    }
  } else {
    // Went unsold
    state.catalogue[itemIdx].status = 'UNSOLD';
    io.emit('auction_announcement', {
      type: 'UNSOLD',
      message: `${item.name} went unsold.`
    });
  }

  // Clear active item
  state.activeItem = null;
  saveState();
  broadcastState();
}

// REST API for basic queries or status page
app.get('/api/status', (req, res) => {
  res.json({
    teamsCount: state.teams.length,
    soldCount: state.catalogue.filter(i => i.status === 'SOLD').length,
    unsoldCount: state.catalogue.filter(i => i.status === 'UNSOLD').length
  });
});

server.listen(PORT, () => {
  console.log(`Circuit Arena Auction Server running on port ${PORT}`);
});
