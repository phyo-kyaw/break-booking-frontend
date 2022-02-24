type RoomParams = {
  id: string;
  title: string;
  address: string;
  roomNumber: number;
  type: string;
  availableType: number;
  city: string;
  description: string;
  floor: number;
  size: number;
  maxPeople: number;
  price: number;
  discount: number;
  rating: number;
  commentCount: number;
  bookedTime: [];
  images: string[];
  facilities: string[];
};

export class Room {
  id: string = '';
  title: string = '';
  address: string = '';
  roomNumber: number = null;
  type?: string = '';
  availableType: number;
  reservedDates: string[];
  city?: string = '';
  description?: string = '';
  floor?: number = null;
  size?: number = null;
  maxPeople?: number = null;
  /**
   * Price in cents. $14.99 means the price is 1499
   */
  price?: number = null;
  /**
   * Percentage
   */
  discount?: number = 0;
  rating?: number = null;
  commentCount?: number = null;
  bookedTime?: [] = [];
  images?: string[] = [];
  facilities?: string[] = [];

  constructor(params?: RoomParams) {
    if (
      typeof params !== 'undefined' &&
      Object.keys(params).length > 0 && // Check if the object is not empty (e.g. `{}`)
      params.constructor === Object // Check if params is an object
    ) {
      this.id = params.id ?? params.id;
      this.title = params.title ?? '';
      this.city = params.city ?? '';
      this.address = params.address ?? '';
      this.roomNumber = params.roomNumber ?? null;
      this.images = params.images ?? [];
      this.description = params.description ?? '';
      this.type = params.type ?? '';
      this.availableType = params.availableType ?? 0;
      this.floor = params.floor ?? null;
      this.size = params.size ?? null;
      this.maxPeople = params.maxPeople ?? null;
      this.price = params.price ?? null;
      this.discount = params.discount ?? 0;
      this.commentCount = params.commentCount ?? null;
      this.bookedTime = params.bookedTime ?? [];
      this.facilities = params.facilities ?? [];
      this.rating = params.rating ?? null;
    }
  }
}
