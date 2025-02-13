import { useEffect, useState } from "react"
import { variables } from "./Variables";

export const Login = (props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    let handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validate(username, password));
        setIsSubmit(true);      
      };

    useEffect(() => {
        if(Object.keys(formErrors).length === 0 && isSubmit){
            console.log(username, password);
            fetch(variables.API_URL+'User/UserLogin', {
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json' 
            },
            body: JSON.stringify({
                UserName: username,
                UserPassword: password
            })
        }).then((res) => {
            const status = res.status;

            if(status !== 200){
                alert(status);
            }else{
                props.isLoggedIn(true);
            }
        })
        }
    }, [formErrors, isSubmit, username, password, props])

    const validate = (username, password) => {
        const errors = {};
        if(!username){
            errors.username = "Username is required!"
        }
        
        if(!password){
            errors.password = "Password is required!"
        }

        return errors;

    }

    return (
        <div className="auth-form-container">
        <h2>Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input style={{borderColor:formErrors.username?"red":"white"}} value={username} onChange={(e)=>setUsername(e.target.value)} type="text" placeholder="username" id="username"></input>
                {formErrors.username ? <p style={{color:"red"}}>{formErrors.username}</p> : null}

                <label htmlFor="password">Password</label>
                <input style={{borderColor:formErrors.password?"red":"white"}} value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="********" id="password"></input>
                {formErrors.password ? <p style={{color:"red"}}>{formErrors.password}</p> : null}

                <button type="submit">Log In</button>
            </form>
            <button className="link-btn" onClick={()=> props.onFormSwitch('register')}>Don't have an account? Register here</button>
        </div>
    )
}