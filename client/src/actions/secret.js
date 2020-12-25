import { serverUrl } from 'App';
import { LOG } from 'utils';


export const performCount = async () => {

   const url =  serverUrl + "/count";

   let response;

   try {
      response = await fetch(url, {
         method: 'GET',
         headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
         }
      });
      LOG(response)
   } catch (e) {
      throw Error('查询失败了，等会再试试呗')
   }

   if (!response || response.status !== 200) {
      throw Error('查询失败了，等会再试试呗')
   }

   const json = await response.json();

   LOG("search result is:");
   LOG(json);
   return json
}


