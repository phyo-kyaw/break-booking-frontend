
export interface Event
{
  // booking: {
  //   bookerEmail: string,
  //   bookerName: string,
  //   bookerPhone: string,
  //   // eventEid: string,
  //   id: string,
  //   // userId: string
  // },
  description: string,
  // eid: string,
  endTime: string,
  location: {
    city: string,
    postCode:string,
    street: string
  },
  price: number,
  startTime:string,
  title: string
}