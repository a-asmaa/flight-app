import { FieldType, Flight } from "../types/flight";
import { BASE_URL } from "../utils/fetchUtils";
import { getToken } from "../utils/storage";


const token = getToken();

export const createFlight = async (payload: string | FormData, withImage: boolean) => {

    const url = `${BASE_URL}/flights`.concat('', withImage ? '/withPhoto' : '');        

    const response = await fetch(url, {
        method: 'POST',
        body: payload,
        headers: {
            "Authorization": `Bearer ${token}`
          }
    });

    // if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    // }
    return response.json();

};


export const updateFlight = async (flightId: string, payload: string | FormData, withImage: boolean) => {

    const url = `${BASE_URL}/flights/${flightId}`.concat('', withImage ? '/withPhoto' : '');        

    const response = await fetch(url, {
        method: 'PUT',
        body: payload,
        headers: {
            "Authorization": `Bearer ${token}`
          }
    });
    return response.json();

};

export const getFlightList = async (page: number, pageSize: number, code?: string) => {


    const getUrl = `${BASE_URL}/flights?page=${page}&size=${pageSize}`

    const url = code ? getUrl + `&code=${code}` : getUrl;
    const response = await fetch(url, {
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json();
};


export const getPayload = (values: FieldType, departureDate: string|null, withImage: boolean = false) => {

    if(withImage) { // create with photo
      
      const formData = new FormData();
      formData.append("code", values.code);
      formData.append("capacity", values.capacity.toString());
      formData.append("departureDate", departureDate?.toString() || '');
      if(values.upload) formData.append('photo', values.upload[0].originFileObj as Blob, values.upload[0].name);   
      return formData;

    } else {
      const _body = {
        'code': values.code,
        'capacity':  values.capacity,
        'departureDate':  departureDate 
      };
      return JSON.stringify(_body);
    }
}