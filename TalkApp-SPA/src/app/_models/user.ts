import { Photo } from './photo';
import { Skill } from './skill';

export interface User {
  id: number;
  userName: string;
  created: Date;
  lastActive: any;
  photoUrl: string;
  city: string;
  country: string;
  introduction?: string;
  lookingFor?: string;
  photos?: Photo[];
  skills?: Skill[];
}
