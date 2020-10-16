import { Photo } from './photo';
import { Skill } from './skill';
import { Rate } from './rate';
import { Language } from './language';

export interface User {
  id: number;
  userName: string;
  created: Date;
  lastActive: any;
  photoUrl?: string;
  city?: string;
  country?: string;
  introduction?: string;
  lookingFor?: string;
  photos?: Photo[];
  skills?: Skill[];
  avgRate?: number;
  raters?: Rate[];
  totalNumOfRates?: number;
  languages: Language[];
}
