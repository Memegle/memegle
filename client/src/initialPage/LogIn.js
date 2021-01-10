import React,{Component} from "react";
import styles from "./style.module.css"
import logo from 'assets/logo-mm-hollow.png';

class LogIn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }

    handleChangeUN = (event) => {
        this.setState({
            username: event.target.value
        })
    }
    handleChangePW = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    async submitInfor() {
        try {
            const url='http://localhost:8080/auth';

            const response = await fetch(url, {
               method: 'POST',
               headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
               },
                body: JSON.stringify({
                key1: this.state.username,
                key2: this.state.password
             })

            }).then(function(response){
            if(response.ok) {
                localStorage.setItem('token', response.data)
            }
            throw new Error('网络不佳，请稍后再试。。');
          })
        }catch (e) {
            throw Error('抱歉, 注册失败。。')
         }
        }

        
    handleSubmit= (event) => {   
        alert(`${this.state.username} ${this.state.password}`) ;
        this.submitInfor();
    
        }

    

    render() {
        return (
                <div className={styles.container}>

                    <div className={styles.header}> Login </div>
            
                 <div className={styles.Content}>
            
                        <div className={styles.Image}>
                            <img src={logo} className={styles.logo} />
                        </div>
                  <div className={styles.ContentRow}>
                          <div className={styles.row}>
                                <label htmlFor="userName" className={styles.label}>userName</label>
                                <input type="text" styleplaceholder="userName" name="username" className={styles.input}
                                value={this.state.username} onChange={this.handleChangeUN }
                               ></input>
                        
                          </div>
            
                    <div className={styles.row}>
                                <label htmlFor="Password" className={styles.label}>Password</label>
                                <input type="text" placeholder="Password" name="password" className={styles.input}
                                onChange={this.handleChangePW} 
                                value={this.state.password}
                                ></input>
                        </div> 
                     </div>
                   </div>
                  
                    <div className={styles.footer}>
                    <button type="button" className={styles.button} 
                    onClick={this.handleSubmit}> Log In</button>
                </div>
              </div>
              )
    };
}
      
  

export default LogIn;
