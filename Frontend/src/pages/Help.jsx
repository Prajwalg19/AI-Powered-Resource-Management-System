import React from "react";

const Helpstaff = () => {
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
                        <b>Equipment Issue:</b> Here the user can report any issues experienced in an equipment by providing details such as Experiment name(where the equipment is being used), Lab name, Number of Equipments(which have issues in them), Details{" "}
                    </li>
                    <br />
                    <li>
                        <b>Equipment Review:</b> Here the user can give review for equipments.The user can input the name of the equipment, Number of Equipments, Date of purchase, Name of the Lab Incharge, Number of equipments not working and Remark for the Equipments
                    </li>
                </ul>
                <br />
                <li>
                    <h3 className="text-xl font-bold mb-2">Staff's Dashboard</h3>
                </li>
                <ul className="pl-8">
                    <li>
                        <b>Equipment Review List:</b>The user can view a list which contains the name of the Equipment, Quantity, Date, Lab Incharge name, number of Equipments not working and remarks for the Equipment
                    </li>
                    <br />
                    <li>
                        <b>Equipment Issue List:</b>The user can view a list which contains the name of the Experiment, name of the Lab and number of Equipments
                    </li>
                </ul>
            </ul>
        </div>
    );
};

export default Helpstaff;
