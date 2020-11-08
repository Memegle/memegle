import { serverUrl } from 'App';
import { LOG } from 'utils';


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
   
   let response;

   try {
      response = await fetch(url, {
         method: 'POST',
         body: JSON.stringify({
            keyword: keyword,
         }),
         headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
         }
      });
   } catch (e) {
      throw Error('查询失败了，等会再试试呗')
   }

   if (!response || response.status !== 200) {
      throw Error('查询失败了，等会再试试呗')
   }

   const json = await response.json();
   if (json.length === 0) {
      throw Error('似乎没有找到符合要求的图片')
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
      return "无法执行空查询";
   }

   return null;
}


export default performSearch;