import { useEffect, useState } from "react";
import { variables } from "./Variables";

export const Register = (props) => {
    const [userFullName, setFullName] = useState("");
    const [userAddress, setUserAddress] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    let handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validate(userFullName, userAddress, dateOfBirth, email, phoneNumber));
        setIsSubmit(true); 
        
      };

    useEffect(() => {
        if(Object.keys(formErrors).length === 0 && isSubmit){
            fetch(variables.API_URL+'User', {
                method:'POST',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json' 
                },
                body: JSON.stringify({
                  UserFullName: userFullName,
                  UserAddress: userAddress,
                  DateOfBirth: dateOfBirth,
                  Email: email,
                  PhoneNumber: phoneNumber
                })
            })
            .then(res=>res.json())
            .then((result)=>{
                alert(result);
            }, (error)=>{
                alert(error);
            })
        }
    })

    const validate = (userFullName, Address, DOB, Email, PhoneNumber) => {
        const errors = {};
        if(!userFullName){
            errors.userFullName = "Full Name is required!"
        }
        
        if(!Address){
            errors.Address = "Address is required!"
        }

        if(!DOB){
            errors.DateOfBirth = "Date Of Birth is required!"
        }

        if(!Email){
            errors.email = "Email is required!"
        }

        if(!PhoneNumber){
            errors.PhoneNumber = "Phone Number is required!"
        }

        return errors;

    }

    return (
        <div className="auth-form-container">
        <h2>Register</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                <label htmlFor="userFullName">Full Name</label>
                <input style={{borderColor:formErrors.userFullName?"red":"white"}} value={userFullName} onChange={(e)=>setFullName(e.target.value)} type="text" placeholder="Full Name" id="userFullName"></input>
                {formErrors.userFullName ? <p style={{color:"red"}}>{formErrors.userFullName}</p> : null}

                <label htmlFor="userAddress">Address</label>
                <input style={{borderColor:formErrors.Address?"red":"white"}}value={userAddress} onChange={(e)=>setUserAddress(e.target.value)} type="text" placeholder="Address" id="userAddress"></input>
                {formErrors.Address ? <p style={{color:"red"}}>{formErrors.Address}</p> : null}

                <label htmlFor="dateOfBirth">Date Of Birth</label>
                <input style={{borderColor:formErrors.DateOfBirth?"red":"white"}}value={dateOfBirth} onChange={(e)=>setDateOfBirth(e.target.value)} type="date" placeholder="DOB" id="dateOfBirth"></input>
                {formErrors.DateOfBirth ? <p style={{color:"red"}}>{formErrors.DateOfBirth}</p> : null}

                <label htmlFor="email">Email</label>
                <input style={{borderColor:formErrors.email?"red":"white"}}value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="email" id="email"></input>
                {formErrors.email ? <p style={{color:"red"}}>{formErrors.email}</p> : null}

                <label htmlFor="phoneNumber">Phone Number</label>
                <input style={{borderColor:formErrors.PhoneNumber?"red":"white"}} value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)} type="tel" placeholder="Phone Number" id="phoneNumber"></input>
                {formErrors.PhoneNumber ? <p style={{color:"red"}}>{formErrors.PhoneNumber}</p> : null}

                <button type="submit">Register</button>
            </form>
            <button className="link-btn" onClick={()=> props.onFormSwitch('login')}>Already have an account? Login here</button>
        </div>
    )
}