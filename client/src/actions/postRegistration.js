
import { LOG } from "utils";
const postRegistration = async (infor) => {
    try {
      
        const response = await fetch('http://localhost:8080/auth', {
           method: 'POST',
           headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
           },
            body: JSON.stringify(infor)

        })

    }catch (e) {
        throw Error('抱歉, 注册失败。。')
     }
    };
    export default postRegistration;

