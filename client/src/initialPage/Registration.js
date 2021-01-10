import React,{Component,useState} from "react";
import styles from "./style.module.css"
import logo from 'assets/logo-mm-hollow.png';
import { LOG } from "../utils";



class Registration extends Component {


    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password:"",
            cfPassword:"",
            hasError:""
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
            const response = await fetch('http://localhost:8080/register', {
               method: 'POST',
               headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
               },
                body: JSON.stringify(this.state)

            }).then(res=>res.json())
            .then((data)=>{
                LOG(data);
            })
         } catch (e) {
            throw Error('抱歉, 注册失败。。')
         }
        }

        
    handleChangeCF = (event) => {

        this.setState({
            cfPassword:event.target.value
        })
        LOG(this.state.cfPassword);
        LOG(this.state.password);
        
       if(this.state.password == event.target.value){
           
        this.state.hasError ="密码一致！!"; 
       } else{
      //  LOG(this.state.cfPassword);
      //  LOG(this.state.password);
        this.state.hasError ="两次输入密码须一致！";
       }
        
    }

    handleSubmit= (event) => {   
    alert(`${this.state.username} ${this.state.password} ${this.state.cfPassword}`) ;
    this.submitInfor();

    }

    

    render() {
        return (
                <div className={styles.container}>

                    <div className={styles.header}> Registration </div>
            
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
                                value={this.state.password}
                                onChange={this.handleChangePW} 
                                ></input>
                          </div> 
                         <div className={styles.row}>
                                <label htmlFor="Password" className={styles.label}>Confirm Password</label>
                                <input type="text" 
                             className={styles.input}
                                value={this.state.cfPassword}
                                onChange={this.handleChangeCF} 
                                ></input>  
                              
                         </div> 
                  </div>
                 <div>{this.state.hasError}</div> 
                  <div className={styles.footer}>
                    <button type="button" className={styles.button} 
                    
                    onClick={this.handleSubmit}> register </button>
                </div>
                </div>
              </div>
              )
    };
}  

export default Registration;