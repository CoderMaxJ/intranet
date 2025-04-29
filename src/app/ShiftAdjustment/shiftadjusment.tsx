import Dashboard from "../Dashboard/dashboard";

export default function ShiftAdjustment() {
  return (
    <><div className="d-flex">
      <div><Dashboard/></div>
      <div className="shiftadjustment-table">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Department</th>
              <th scope="col">Break</th>
              <th scope="col">Work Hours</th>
              <th scope="col">Time</th>
              <th scope="col">Date Filed</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>John</td>
              <td>Doe</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}