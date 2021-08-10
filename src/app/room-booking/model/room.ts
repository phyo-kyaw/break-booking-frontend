type RoomParams = {
  id: string;
  title: string;
  address: string;
  roomNumber: number | null;
  type: string;
  city: string;
  description: string;
  floor: number | null;
  size: number | null;
  maxPeople: number | null;
  price: number | null;
  discount: number;
  rating: number | null;
  commentCount: number | null;
  bookedTime: [];
  images: string[];
  facilities: string[];
};

export class Room {
  id: string = '';
  title: string = '';
  address: string = '';
  roomNumber: number | null = null;
  type: string = '';
  city: string = '';
  description: string = '';
  floor: number | null = null;
  size: number | null = null;
  maxPeople: number | null = null;
  price: number | null = null;
  discount: number = 0;
  rating: number | null = null;
  commentCount: number | null = null;
  bookedTime: [] = [];
  images: string[] = [];
  facilities: string[] = [];

  constructor(params?: RoomParams) {
    if (
      typeof params !== 'undefined' &&
      Object.keys(params).length > 0 && // Check if the object is not empty (e.g. `{}`)
      params.constructor === Object // Check if params is an object
    ) {
      console.log('arg is present in Room constructor');

      this.id = params.id ?? params.id;
      this.title = params.title ?? '';
      this.city = params.city ?? '';
      this.address = params.address ?? '';
      this.roomNumber = params.roomNumber ?? null;
      this.images = params.images ?? [];
      this.description = params.description ?? '';
      this.type = params.type ?? '';
      this.floor = params.floor ?? null;
      this.size = params.size ?? null;
      this.maxPeople = params.maxPeople ?? null;
      this.price = params.price ?? null;
      this.discount = params.discount ?? 0;
      this.commentCount = params.commentCount ?? null;
      this.bookedTime = params.bookedTime ?? [];
      this.facilities = params.facilities ?? [];
      this.rating = params.rating ?? null;
    } else {
      console.log('arg is not provided to Room constructor');
    }
  }
}
