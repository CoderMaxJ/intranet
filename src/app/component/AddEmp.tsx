import { Decryptor } from "@/security";
import { useEffect, useState } from "react";


interface AddEmployeeData {
  empno: string;
  fname: string;
  mname: string;
  lname: string;
  position: string;
  dateofbirth: string;
  maritalstatus: string;
  gender: string;
  contactno: string;
  address: string;
  
}



export default function AddEmp({ empData, mode }: { empData: any; mode: any }) {
  
  const currentData = empData;
  const [position, setPosition] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [gender, setGender] = useState("");
  const [roles,setRoles]=useState<string[]>([]);


  useEffect(() => {
    const currentData2 = currentData;

    if (empData.maritalstatus !== "") {

      setMaritalStatus(empData.maritalstatus);
    }

    if (empData.gender !== "") {
      setGender(empData.gender);
    }

    if (empData.position !== "") {
      setPosition(empData.position);
    }
  }, [empData]);

  function FormInput({
    id,
    label,
    type,
    classType,
    value,
  }: {
    id: string;
    label: string;
    type: string;
    classType: string;
    value: string;
  }) {
    const [inputValue, setInputValue] = useState(value);

    return (
      <div className={`mb-3 ${classType}`}>
        <label htmlFor={id} className="form-label">
          {label}
        </label>
        <input
          type={type}
          name={id}
          className="form-control"
          id={id}
          defaultValue={inputValue ? inputValue : ""}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
    );
  }


  const undoSelect=(value:any,mode:any)=>{
 
    if(value && mode == 'edit'){
      setMaritalStatus(value);
      
    }
  }

  const handleSelect=(value:any,mode:any)=>{

    if(value && mode == 'edit'){
      setGender(value);
      
    }

  }
    const handleSelectPosition=(value:any,mode:any)=>{
      if(value && mode == 'edit'){
        setPosition(value);
        
      }

  }
  

const information = {
  fname:currentData.fname,
  mname:currentData.mname,
  lname:currentData.lname,
  address:currentData.address,
  maritalstatus:maritalStatus,
  dateofbirth:currentData.birthofdate,
  gender:currentData.gender,
  position:position,
  contacto:currentData.contactno


}

  const handleSubmitForm = async (e:any)=>{
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log("information",information)
 
   try{
    const respose = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/employee/create/`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${Decryptor(token)}`,
        
      },
      body: JSON.stringify(information)
    }) 

    if(respose.status == 200){
      console.log("EMPLOYEE CREATED SUCCESSFULLY");
    }
   }
   
   catch(e){
    console.error(e);
   }
  
  }


  const rolesList = async ()=>{
    const token = localStorage.getItem("token");
    const cachedRoles = localStorage.getItem("roles");
    if (cachedRoles) {
      setRoles(JSON.parse(cachedRoles)); // Load from cache
      return;
    }
    try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/roles/list/`,{
        method:"GET",
        headers:{
          "Content-Type":"application/json",
          Authorization: `Bearer ${Decryptor(token)}`
        }
      })
      if(response.status == 200){
        const data = await response.json();
        setRoles(data.data);
        localStorage.setItem("roles", JSON.stringify(data.data));
      }
    } catch(e){
      console.error(e);
    }
  }

  // rolesList();

  return (
    <div>
      <form className="row" onSubmit={handleSubmitForm}>
        <FormInput
          id="fname"
          type="text"
          label="First Name"
          classType={"col-md-4"}
          value={currentData.fname}
        />
        <FormInput
          id="mname"
          type="text"
          label="Middle Name"
          classType={"col-md-4"}
          value={currentData.mname}
        />
        <FormInput
          id="lname"
          type="text"
          label="Last Name"
          classType={"col-md-4"}
          value={currentData.lname}
        />
        <FormInput
          id="dob"
          type="date"
          label="Date of Birth"
          classType={"col-md-3"}
          value={currentData.dateofbirth}
        />
        <div className="col-md-2 mb-3">
          <label htmlFor="gender" className="form-label">
            Martital Status
          </label>
          <select
            value={maritalStatus}
            id="gender"
            className="form-select"
            aria-label="Default select example"
            onChange={(e) => undoSelect(e.target.value,mode)}
          >
            <option value="0"></option>
            <option value="Maried1">Maried</option>
            <option value="Single">Single</option>
            <option value="Separated">Separated</option>
            <option value="Widowed">Widowed</option>
            <option value="Divorced">Divorced</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="col-md-2 mb-3">
          <label htmlFor="gender" className="form-label">
            Gender
          </label>
          <select
            value={gender}
            id="gender"
            className="form-select"
            aria-label="Default select example"
            onChange={(e) => handleSelect(e.target.value,mode)}
          >
            <option value="0"></option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <FormInput
          id="contact"
          type="number"
          label="Contact No"
          classType={"col-md-5"}
          value={currentData.contactno}
        />
        <FormInput
          id="address"
          type="text"
          label="Address"
          classType={"col-md-6"}
          value={currentData.address}
        />
        <div className="col-md-6 mb-3">
        
        <select
  value={position} // ✅ Should hold a single selected value
    id="position"
    className="form-select"
    aria-label="Default select example"
    onFocus={rolesList}
    onChange={(e) => {
    if (mode === 'edit') {
      handleSelectPosition(e.target.value, mode);
    } else {
      setPosition(e.target.value); // ✅ Update position for non-edit mode
    }
  }}
>
  <option value="">Select a position</option>
  {roles.map((role, index) => (
    <option key={index} value={role}>{role}</option>
  ))}
</select>

        </div>
        {/* <FormInput
          id="position"
          type="text"
          label="Position"
          classType={"col-md-6"}
          value={currentData.position}
        /> */}

        <div
          className="col-md-12"
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            gap: "50px",
            marginBottom: "30px",
            marginTop: "30px",
          }}
        >
          <button type="button" className="btn btn-danger">
            Cancel
          </button>
          <button type="button" onClick={handleSubmitForm} className="btn btn-primary">
            {mode == "edit" ? "Edit" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
