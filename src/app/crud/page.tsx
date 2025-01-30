"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function CreateUD() {
  return (
    <div className="crud-maindiv">
      <div>
        <header className="crud-header"><h1>Manage Employees</h1></header> 
        <button className="add">
          <a href="/Empinfo">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16" style={{ marginLeft: "2px", marginRight: "5px", alignItems:'center', marginBottom:'5px' }}>
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
</svg> 
        Add New Employees
        </a>
        </button>
        </div>

        <div>
        <table className="table table-striped table-hover">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Employee No.</th>
      <th scope="col">First Name</th>
      <th scope="col">Middle Name</th>
      <th scope="col">Last Name</th>
      <th scope="col">User Name</th>
      <th scope="col">Password</th>
      <th scope="col">Position</th>
      <th scope="col">Contact No.</th>
      <th scope="col">Actions</th>



    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>20251</td>
      <td>John Cel</td>
      <td>Labajo</td>
      <td>Rio</td>
      <td>John</td>
      <td>Ipsumlorem</td>
      <td>Developer</td>
      <td>09893776467</td>
      <td></td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>20252</td>
      <td>Johnsen</td>
      <td>Alquizola</td>
      <td>Sopeta</td>
      <td>Bombastic</td>
      <td>Ipsumlorem2</td>
      <td>Developer</td>
      <td>09893776467</td>
      <td></td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>20253</td>
      <td>Gilbert</td>
      <td>Nonchalant</td>
      <td>Fuentes</td>
      <td>Gilberto</td>
      <td>Ipsumlorem1</td>
      <td>Developer</td>
      <td>09893776467</td>
      <td></td>
    </tr>
    <tr>
      <th scope="row">4</th>
      <td>20254</td>
      <td>John Cel</td>
      <td>Labajo</td>
      <td>Rio</td>
      <td>John</td>
      <td>Ipsumlorem67</td>
      <td>Developer</td>
      <td>09893776467</td>
      <td></td>
    </tr>
    <tr>
      <th scope="row">5</th>
      <td>20255</td>
      <td>Ian Vincent</td>
      <td>Alquizalas</td>
      <td>Brufal</td>
      <td>Ianzkie</td>
      <td>Ipsumlorem6</td>
      <td>Developer</td>
      <td>09893776467</td>
      <td></td>
    </tr>
  </tbody>
</table>
</div>
    </div>
  );
}