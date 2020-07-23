import { serverUrl } from '../App'
import { LOG } from '../utils'

/** Write comprehensive documentation for this file **/

/**
 *
 * @param keyword - query keyword
 * @param page - page to display, index starts from 1 (i.e. page 1 is the first page)
 */
const performSearch = async (keyword, page=1) => {
   let error = validateQuery(keyword, page);
   if (error) {
      throw Error(error);
   }

   const url =  serverUrl + "/search";

   LOG("Using " + url)

   LOG(
       "Dispatching Search Query:\n" +
       "keyword="+keyword+"\n" +
       "page="+page+"\n"
   )

   let response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
         keyword: keyword,
         page: page - 1,
      })
   });

   return response.json()
}

const validateQuery = (keyword, page) => {
   if (keyword.length === 0) {
      return "Empty query";
   }

   if (page < 1) {
      return "Invalid page number " + page;
   }

   return null;
}


export default performSearch;