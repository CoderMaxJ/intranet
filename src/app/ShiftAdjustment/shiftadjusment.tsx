"use client";
import { useState } from 'react';
import Dashboard from "../Dashboard/dashboard";
import Header from "../component/Header";
import Drawer from "../component/Drawer/drawer";

export default function ShiftAdjustment() {
      const [searchTerm, setSearchTerm] = useState('');
      const [searchTerm1, setSearchTerm1] = useState('');

      const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value);
      }

      // const filteredData = data.filter((item)=>
      // item.toLowerCase().includes(searchTerm.toLowerCase())
      // );

      const handleFilterBreaks = (e: React.ChangeEvent<HTMLInputElement>)=> {
            setSearchTerm1(e.target.value);
      };


      return (
            <div className="d-flex">
                  <div><Dashboard /></div>

                  <div className="shiftadjustment-container">
                        <div>
                              <Header title="MANAGE SHIFT ADJUSTMENT" />
                        </div>

                        <div className="shiftadjusment-table p-4 px-4">
                              <div className="shiftadjustment-table d-flex justify-content-between mb-3">
                                    <div style={{ background: 'yellow' }}><input
                                          className="searchbar"
                                          type="text"
                                          placeholder="Search..."
                                    //     value={searchQuery}
                                    //     onChange={handleSearchChange}
                                    /></div>
                                    <div style={{ background: 'yellowgreen' }}> <input
                                          type="text"
                                          id="myInput"
                                          className="form-control mb-3"
                                          placeholder="Accounts"
                                          value={searchTerm}
                                          onChange={handleSearchChange}
                                    /></div>
                                    <div style={{ background: 'violet' }}>
                                          <input
                                                type='text'
                                                id="breaks-filter"
                                                className='form-control'
                                                placeholder='Breaks'
                                                value={searchTerm1}
                                                onChange={handleFilterBreaks}
                                          >
                                          </input></div>
                                    <div style={{ background: 'pink' }}>-------work hours----------</div>
                                    <div style={{ background: 'orange' }}>-------apply----------</div>
                              </div>

                              <div className="shiftadjustment-table">
                                    <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#shiftdrawer" aria-controls="shiftdrawer">
                                          Toggle right offcanvas
                                    </button>

                                    <table className="table mt-3">
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
                  </div>

                  <Drawer /> {/* ⬅️ Add this so the offcanvas component is in the DOM */}
            </div>
      );
}
