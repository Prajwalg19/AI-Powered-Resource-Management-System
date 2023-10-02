import React from "react";

const Helpadmin = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4"></h1>
            <p className="text-xl mb-6"></p>

            <h2 className="text-2xl font-bold mb-2">Key Features:</h2>
            <ul className="text-xl list-disc pl-6 mb-6">
                <li>
                    <h3 className="text-xl font-bold mb-2">Details</h3>
                </li>
                <ul className="pl-8">
                    <li>
                        <b>Equipment Issue:</b> Here the user can report any issues experienced in an equipment by providing details such as Experiment name(where the equipment is being used), Lab Incharge ID, Number of Equipments(which have issues in them), Details{" "}
                    </li>
                    <br />
                    <li>
                        <b>Department Info:</b>Here the user can enter department details by specifying Department number, choose the department from the dropdown and name of the HOD of that department
                    </li>
                    <br />
                    <li>
                        <b>Purchase Order Details:</b>Here the user can enter purchase order details by specifying purchase order number, date of purchase, the name of supplier and purchase order value
                    </li>
                    <br />
                    <li>
                        <b>Lab Details:</b>Here the user can enter Lab details by specifying lab room number, Department Number, Location of the lab and Lab Incharge
                    </li>
                    <br />
                    <li>
                        <b>Equipment Details:</b>Here the user can enter Equipment details by specifying Equipment Serial Number, date,{" "}
                    </li>
                    <br />
                    <li>
                        <b>Equipments Review:</b>Here the user can enter Equipment Review by specifying name of the Equipment, Number of Equipments, Date of Review, Name of Lab Incharge, Number equipment not working and Remarks for the Equipment
                    </li>
                </ul>
                <br />
                <li>
                    <h3 className="text-xl font-bold mb-2">Admin's Dashboard</h3>
                </li>
                <ul className="pl-8">
                    <li>
                        <b>Department List:</b>The user can view a list which contains Department Number, Department Name and Head of Department
                    </li>
                    <br />
                    <li>
                        <b>Labs List:</b>The user can view a list which contains Lab Number, Department and Location
                    </li>
                    <br />
                    <li>
                        <b>Purchase Order List:</b>The user can view a list which contains Purchase order number, Purchase date, Supplier name and Total Value
                    </li>
                    <br />
                    <li>
                        <b>Equipment List:</b>The user can view a list which contains Purchase Date, Equipment Value, Lab Number and Status
                    </li>
                    <br />
                    <li>
                        <b>Equipment Review List:</b>The user can view a list which contains the name of the Equipment, Quantity, Date, Lab Incharge name, number of Equipments not working and remarks for the Equipment
                    </li>
                    <br />
                    <li>
                        <b>Equipment Issue List:</b>The user can view a list which contains the name of the Experiment, name of the Lab and number of Equipments
                    </li>
                    <br />
                    <li>
                        <b>Equipment Details:</b>Here the user can enter Equipment details by specifying Equipment Serial Number, date
                    </li>
                </ul>
            </ul>
        </div>
    );
};

export default Helpadmin;
