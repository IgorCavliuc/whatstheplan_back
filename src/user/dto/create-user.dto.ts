// src/user/dto/create-user.dto.ts
export class CreateUserDto {
  id?: string;
  email: string;
  password: string;
  name: string;
  surename: string;
  status?: 'active' | 'inactive' | 'suspended';
  birthday?: string;
  people_data?: {
    followersCount?: number;
    followingCount?: number;
    visitorCount?: number;
  };
  contact?: {
    phone?: string;
    insta?: string;
    facebook?: string;
    telegram?: string;
    viber?: string;
    whatsapp?: string;
  };
  image?: {
    profile?: string;
    wallpaper?: string;
  };
  profession?: {
    label?: string;
    value?: string;
  };
  scope?: {
    voice?: number;
    value?: number;
  };
  worked_country?: object;
  country_of_live?: object;
  spoken_language?: object;
  createdAt?: Date;
  updatedAt?: Date;
}
