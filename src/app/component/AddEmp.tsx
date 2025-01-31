export default function AddEmp() {
  function FormInput({
    id,
    label,
    type,
    classType,
  }: {
    id: string;
    label: string;
    type: string;
    classType: string;
  }) {
    return (
      <div className={`mb-3 ${classType}`}>
        <label htmlFor={id} className="form-label">
          {label}
        </label>
        <input type={type} name={id} className="form-control" id={id} />
      </div>
    );
  }

  return (
    <div>
      <form className="row">
        <FormInput
          id="fname"
          type="text"
          label="First Name"
          classType={"col-md-4"}
        />
        <FormInput
          id="mname"
          type="text"
          label="Middle Name"
          classType={"col-md-4"}
        />
        <FormInput
          id="lname"
          type="text"
          label="Last Name"
          classType={"col-md-4"}
        />
        <FormInput
          id="dob"
          type="date"
          label="Date of Birth"
          classType={"col-md-3"}
        />
         <div className="col-md-2 mb-3" >
          <label htmlFor="gender" className="form-label">Martital Status</label>
          <select id="gender" className="form-select" aria-label="Default select example">
             <option value="1"></option>
            <option value="1">Maried</option>
            <option value="2">Single</option>
            <option value="1">Separated</option>
            <option value="2">Widowed</option>
            <option value="1">Divorced</option>
            <option value="2">Other</option>
          </select>
        </div>
        <div className="col-md-2 mb-3" >
          <label htmlFor="gender" className="form-label">Gender</label>
          <select id="gender" className="form-select" aria-label="Default select example">
           <option value="1"></option>
            <option value="1">Male</option>
            <option value="2">Female</option>
          </select>
        </div>
        <FormInput
          id="contact"
          type="number"
          label="Contact No"
          classType={"col-md-5"}
        />
        <FormInput
          id="address"
          type="text"
          label="Address"
          classType={"col-md-6"}
        />
        <FormInput
          id="position"
          type="text"
          label="Position"
          classType={"col-md-6"}
        />

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
          <button type="submit" className="btn btn-danger">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
