export type User = {
    id: string;
    username: string;
    email: string;
    fullName: string;
    profilePicture?: string | null;
    bio?: string | null;
    createdAt: Date;
    updatedAt: Date;
    hackathonParticipations: HackathonParticipation[];
    teamMemberships: TeamMember[];
  };
  
  export type Hackathon = {
    id: string;
    name: string;
    description: string;
    location: string;
    startDate: Date;
    endDate: Date;
    maxParticipants: number;
    registrationDeadline: Date;
    status: HackathonStatus;
    createdAt: Date;
    updatedAt: Date;
    participants: HackathonParticipation[];
    teamParticipations: TeamParticipation[];
    topics: Topic[];
  };
  
  export type HackathonParticipation = {
    id: string;
    userId: string;
    hackathonId: string;
    teamParticipationId?: string | null;
    totalScore: number;
    qrPass?: string | null;
    checkedIn: boolean;
    checkedInAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    hackathon: Hackathon;
    teamParticipation?: TeamParticipation | null;
  };
  
  export type Team = {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    members: TeamMember[];
    teamParticipations: TeamParticipation[];
  };
  
  export type TeamParticipation = {
    id: string;
    teamId: string;
    hackathonId: string;
    totalScore: number;
    qrCode?: string | null;
    createdAt: Date;
    updatedAt: Date;
    team: Team;
    hackathon: Hackathon;
    participants: HackathonParticipation[];
  };
  
  export type TeamMember = {
    id: string;
    teamId: string;
    userId: string;
    role: TeamRole;
    createdAt: Date;
    updatedAt: Date;
    team: Team;
    user: User;
  };
  
  export type Topic = {
    id: string;
    hackathonId: string;
    name: string;
    createdAt: Date;
    hackathon: Hackathon;
  };
  
  export enum TeamRole {
    LEADER = 'LEADER',
    MEMBER = 'MEMBER',
  }
  
  export enum HackathonStatus {
    UPCOMING = 'UPCOMING',
    ONGOING = 'ONGOING',
    FINISHED = 'FINISHED',
  }
  