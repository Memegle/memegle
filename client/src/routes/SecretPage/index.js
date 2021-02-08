import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import {count} from "actions/count";
import {postLogin,postRegistration} from 'actions/auth.js';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toWelcome: false,
            loginUsername: '',
            loginPassword: '',
            registerUsername: '',
            registerPassword: '',
            registerConfirmPassword: '',
            checkError:""
        };
        this.handleRedirection = this.handleRedirection.bind(this);
    }

    handleRedirection(event) {
        event.preventDefault();
        this.setState({toWelcome: true});
    }

    // Functions for register input Boxes 
    handleNameChange = (event) => {
        this.setState({
            loginUsername: event.target.value
        })
    }
    handlePasswordChange = (event) => {
        this.setState({
           loginPassword: event.target.value
        })
    }

    handleSubmit= (event) => {   
        alert(`${this.state.loginUsername} ${this.state.loginPassword}`) ;
        postLogin(this.state);
        }

    handleRegisterNameChange = (event) => {
        this.setState({
            registerUsername: event.target.value
        })
    }
    handleRegisterPasswordChange   = (event) => {
        this.setState({
            registerPassword: event.target.value
        })
    }

    handleRegisterConfirmChange= (event) => {
        this.setState({
            registerConfirmPassword:event.target.value
        })

        if(this.state.registerPassword == event.target.value){
               
            this.state.checkError ="密码一致！!"; 
        } else{
          
            this.state.checkError ="两次输入密码须一致！";
        }
    }
    
    handleRegisterSubmit = (event) => {   
        alert(`${this.state.registerUsername} ${this.state.registerPassword} ${this.state.registerConfirmPassword}`) ;
        postRegistration(this.state);
    }


    render() {
        if (this.state.toWelcome) {
            return <Redirect to='welcome'/>;
        }


    return(

    <div>
        <button onClick={this.handleRedirection} > Go Back! </button>
        
        <p> Login </p>

        <form>
            <label htmlFor="userName" >userName</label>
        
            <input type="text" styleplaceholder="userName" name="username"
            value={this.state.loginUsername} onChange={this.handleNameChange }
            ></input>
            <button type="button" onClick={this.handleSubmit}> Log In</button>

            <label htmlFor="Password" >Password</label>

            <input type="text" placeholder="Password" name="password"
            onChange={this.handlePasswordChange} 
            value={this.state.loginPassword}></input>
        
        </form>

        <p> Registration </p>

        <form>
            <label htmlFor="userName">userName</label>

            <input type="text" styleplaceholder="userName" name="username" 
            value={this.state.registerUsername} onChange={this.handleRegisterNameChange}
            ></input>

            <label htmlFor="Password">Password</label>

            <input type="text" placeholder="Password" name="password"
            value={this.state.registerPassword}
            onChange={this. handleRegisterPasswordChange }></input>
                      
            <label htmlFor="Password" >Confirm Password</label>

            <input type="text" value={this.state. registerConfirmPassword}
            onChange={this.handleRegisterConfirmChange} ></input>  
            <div>{this.state.checkError}</div> 
            <button type="button" onClick={this.handleRegisterSubmit}> register </button>
        </form>


    </div>           
    )
    }
};

export default index;