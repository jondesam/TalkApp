import { Photo } from './photo';
import { Skill } from './skill';
import { Rate } from './rate';

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
  raters?: Rate[];
}
