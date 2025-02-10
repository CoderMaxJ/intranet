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



export default function AddEmp({ empData, mode }: { empData: any; mode: any },isClose:void) {
  
  const currentData = empData;
  const [position, setPosition] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [gender, setGender] = useState("");
  const [roles,setRoles]=useState<string[]>([]);
  const [form2,setForm2]=useState({});

 

  useEffect(() => {
    setForm2(empData)
   
    if (empData.maritalstatus) {

      setMaritalStatus(empData.maritalstatus);
    }

    if (empData.gender ) {
      setGender(empData.gender);
    }

    if (empData.position ) {
      setPosition(empData.position);
    }
  }, [empData]);

console.log("Form 2",form2)
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


  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    // ✅ Update corresponding state
    if (name === "maritalstatus") setMaritalStatus(value);
    if (name === "gender") setGender(value);
    if (name === "position") setPosition(value);
  
    // ✅ Update form2 with dynamic key
    setForm2((prev) => ({ ...prev, [name]: value }));
  };
  

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

    let information: Record<string, string> = {};

    const form = e.target;
    
    form.querySelectorAll("input").forEach((input: any) => {
      const name = input.getAttribute("name");
      if (name) {
        information[name] = input.value; 
      }
    });

    form.querySelectorAll("select").forEach((select: any) => {
      const name = select.getAttribute("name");
      if (name) {
        information[name] = select.value; 
      }
    });
    
    console.log("Final Information:", information);
    
 console.log("information:" ,information.fname)
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
          id="dateofbirth"
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
          name="maritalstatus"
            value={maritalStatus}
            id="gender"
            className="form-select"
            aria-label="Default select example"
            onChange={handleSelectChange}
          >
            <option value="Single">Single</option>
            <option value="Maried1">Maried</option>
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
          name="gender"
            value={gender}
            id="gender"
            className="form-select"
            aria-label="Default select example"
            onChange={handleSelectChange}
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
    value={position}
    name="position"
    id="position"
    className="form-select"
    aria-label="Default select example"
    onFocus={rolesList}
    onChange={handleSelectChange}
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
          <button type="button"  className="btn btn-danger">
            Close
          </button>
          <button type="submit" className="btn btn-primary">
            {mode == "update" ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
