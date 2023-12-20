import { Image } from "./image";

export interface Shop {
  id: number;
  nomBoutique: string;
  longitude: string;
  latitude: string;
  active?: any;
  serviceIds: any[];
  commentaireIds: any[];
  noteId?: any;
  compteIds: any[];
  quartierId: number;
  activatedId?: any;
  heureOuverture: HeureOuverture;
  imageIds: Image[];
  niu?: any;
  tel?: any;
  emplacement?: any;
  status: string;
}

interface HeureOuverture {
  SUNDAY: Day;
  MONDAY: Day;
  TUESDAY: Day;
  WEDNESDAY: Day;
  THURSDAY: Day;
  FRIDAY: Day;
  SATURDAY: Day;
}

interface Day {
  heureDebut: string;
  heureFin: string;
}