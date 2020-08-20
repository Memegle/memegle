import { serverUrl } from '../App'
import { LOG } from '../utils'

/** Write comprehensive documentation for this file **/

/**
 *
 * @param keyword - query keyword
 */
const performSearch = async (keyword) => {
   let error = validateQuery(keyword);
   if (error) throw Error(error);

   const url =  serverUrl + "/search";

   LOG("searching at: " + url)

   LOG(
       "Dispatching Search Query:\n" +
       "keyword="+keyword+"\n"
   )

   let response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
         keyword: keyword,
      }),
      headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json'
      }
   });

   if (response.status !== 200) {
      throw Error("Failed to fetch result")
   }

   const json = await response.json();
   if (json.length === 0) {
      throw Error('Empty result')
   }

   LOG("search result is:");
   LOG(json);
   return json
}

export const getSearchRoute = (keyword) => {
   const error = validateQuery(keyword)
   if (error) throw Error(error);

   return '/search?keyword=' + keyword;
}

const validateQuery = (keyword) => {
   if (keyword.length === 0) {
      return "Empty query";
   }

   return null;
}


export default performSearch;