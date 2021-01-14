import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import paths from "./routes/paths";
import PrintNum from "./PrintNum";
import {postLogIn,postRegistration} from 'actions/auth';

class secretPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toWelcome: false,
            D: '',
            log_Password: '',
            reg_Username: '',
            reg_Password: '',
            reg_confirmPassword: '',
            checkError:""
        };
        this.handleRedirection = this.handleRedirection.bind(this);
    }

    handleRedirection(event) {
        event.preventDefault();
        this.setState({toWelcome: true});
    }

    // Functions for register input Boxes 
    handleChangeName = (event) => {
        this.setState({
            log_Username: event.target.value
        })
    }
    handleChangePassWord = (event) => {
        this.setState({
            log_Password: event.target.value
        })
    }

    handleSubmit= (event) => {   
        alert(`${this.state.log_Username} ${this.state.log_Password}`) ;
        postLogIn(this.state);
        }

        handleChangeName_Reg  = (event) => {
            this.setState({
                reg_Username: event.target.value
            })
        }
        handleChangePassWord_Reg   = (event) => {
            this.setState({
                reg_Password: event.target.value
            })
        }

        handleChangeCF_Reg = (event) => {

            this.setState({
                reg_confirmPassword:event.target.value
            })

           if(this.state.reg_Password == event.target.value){
               
            this.state.checkError ="密码一致！!"; 
           } else{
          
            this.state.checkError ="两次输入密码须一致！";
           }
            
        }
    
        handleSubmit_Reg= (event) => {   
        alert(`${this.state.reg_Username} ${this.state.reg_Password} ${this.state.  reg_confirmPassword}`) ;
        postRegistration(this.state);
    
        }

    render() {
        if (this.state.toWelcome) {
            return <Redirect to='welcome'/>;
        }


        return(
            <div>
            <PrintNum />
            <button onClick={this.handleRedirection} > Go Back! </button>

          
            <div > Login </div>

                      <div>
                        <div>
                                <label htmlFor="userName" >userName</label>
                                <input type="text" styleplaceholder="userName" name="username"
                                value={this.state.log_Username} onChange={this.handleChangeName }
                               ></input>
                        
                          </div>
            
                    <div>
                                <label htmlFor="Password" >Password</label>
                                <input type="text" placeholder="Password" name="password"
                                onChange={this.handleChangePassWord} 
                                value={this.state.log_Password}
                                ></input>
                        </div> 

                        <div >
                                <button type="button"
                                onClick={this.handleSubmit}> Log In</button>
                        </div>

                    </div>



                     <div> Registration </div>
                     <div>
                          <div>
                                <label htmlFor="userName">userName</label>
                                <input type="text" styleplaceholder="userName" name="username" 
                                value={this.state.reg_Username} onChange={this.handleChangeName_Reg }
                               ></input>
                          </div>
            
                         <div>
                                <label htmlFor="Password">Password</label>
                                <input type="text" placeholder="Password" name="password"
                                value={this.state.reg_Password}
                                onChange={this.handleChangePassWord_Reg } 
                                ></input>
                          </div> 
                          <div>
                                <label htmlFor="Password" >Confirm Password</label>
                                <input type="text" 
                        
                                value={this.state. reg_confirmPassword}
                                onChange={this.handleChangeCF_Reg} 
                                ></input>  
                              
                         </div> 
                    </div>
                 <div>{this.state.hasError}</div> 
                  <div >
                  <div>{this.state.checkError}</div> 
                    <button type="button"  
                    onClick={this.handleSubmit_Reg}> register </button>

                  </div>
        </div>
    )
    }
};

export default secretPage;