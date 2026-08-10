export type TeamStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Participant {
  name: string;
  email: string;
  phone: string;
  collegeId: string;
  isLeader?: boolean;
}

export interface Team {
  teamId: string;
  teamName: string;
  college: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  teamSize: number;
  status: TeamStatus;
  createdAt: string;
  participants: Participant[];
  transactionId?: string;
}

export interface TeamScore {
  teamId: string;
  teamName: string;
  budgetScore: number;         // Max 15
  designScore: number;         // Max 25
  technicalScore: number;      // Max 15
  implementationScore: number; // Max 30
  troubleshootingScore: number;// Max 15
  totalScore: number;          // Max 100
}

export interface Announcement {
  id: string;
  title: string;
  category: string;
  content: string;
  date: string;
  priority: 'HIGH' | 'NORMAL' | 'URGENT';
}

export interface AuctionComponent {
  id: string;
  name: string;
  category: string;
  rarity: 'HIGH' | 'MEDIUM' | 'PREMIUM';
  basePrice: number;
  currentBid: number;
  highBidder: string;
  iconName: string;
}

export interface StoreItem {
  id: string;
  name: string;
  price: number;
  category: string;
  unit: string;
}
