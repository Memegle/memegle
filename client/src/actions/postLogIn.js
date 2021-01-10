

import { LOG } from "utils";

const postLogIn = async () => {
        try {
            const response = await fetch('http://localhost:8080/register', {
               method: 'POST',
               headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
               },
                body: JSON.stringify(this.state)

            })

            if(response.ok) {
               localStorage.setItem('token', response.data)
           }
           
         } catch (e) {
            throw Error('抱歉, 注册失败。。')
         }
        };

   export default postLogIn;
