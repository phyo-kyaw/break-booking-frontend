type RoomParams = {
  id: number | null;
  name: string;
  city: string;
  address: string;
  roomNumber: number | null;
  images: any[];
  description: string;
  type: string;
  floor: number | null;
  size: string;
  maxPeople: number | null;
  price: number | null;
  discount: number;
  commentCount: number | null;
  bookedTime: [];
  facilities: string;
  popularity: number | null;
};

export class Room {
  id: number | null = null;
  name: string = '';
  city: string = '';
  address: string = '';
  roomNumber: number | null = null;
  images: any[] = [];
  description: string = '';
  type: string = '';
  floor: number | null = null;
  size: string = '';
  maxPeople: number | null = null;
  price: number | null = null;
  discount: number = 0;
  commentCount: number | null = null;
  bookedTime: [] = [];
  facilities: string = '';
  popularity: number | null = null;

  constructor(params?: RoomParams) {
    if (
      typeof params !== 'undefined' &&
      Object.keys(params).length > 0 && // Check if the object is not empty (e.g. `{}`)
      params.constructor === Object // Check if params is an object
    ) {
      console.log('arg is present in Room constructor');

      this.id = params.id ?? params.id;
      this.name = params.name ?? '';
      this.city = params.city ?? '';
      this.address = params.address ?? '';
      this.roomNumber = params.roomNumber ?? null;
      this.images = params.images ?? [];
      this.description = params.description ?? '';
      this.type = params.type ?? '';
      this.floor = params.floor ?? null;
      this.size = params.size ?? '';
      this.maxPeople = params.maxPeople ?? null;
      this.price = params.price ?? null;
      this.discount = params.discount ?? 0;
      this.commentCount = params.commentCount ?? null;
      this.bookedTime = params.bookedTime ?? [];
      this.facilities = params.facilities ?? '';
      this.popularity = params.popularity ?? null;
    } else {
      console.log('arg is not provided to Room constructor');
    }
  }
}
