export interface IGenrePayload {
  name: string;
  slug?: string;
  description?: string;
  iconUrl?: string;
  bannerUrl?: string;
  isActive?: boolean;
  displayOrder?: number;
}
