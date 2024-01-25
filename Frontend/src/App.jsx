import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Issue from "./pages/Issues";
import Header from "./Components/Header";
import Home from "./pages/Home";
import Purchase from "./pages/PurchaseOrderForm";
import Departmentform from "./pages/DepartmentForm";
import EquipmentDetailsForm from "./pages/EquipmentDetailsForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LabInformation from "./pages/LabInformationForm";
import Profile from "./pages/Profile";
import Lablist from "./Components/DashboardPages/Lablist";
import IssuesList from "./Components/DashboardPages/IssuesList";
import PurchaseList from "./Components/DashboardPages/PurchaseList";
import EquipmentList from "./Components/DashboardPages/EquipmentList";
import Login from "./pages/Login";
import EquipmentsReviewList from "./Components/DashboardPages/EquipmentReviewList";
import EquipmentsReview from "./pages/EquipmentsReview";
import Register from "./pages/Register";
import PrivateRoute from "./Hooks/PrivateRoute";
import DepartmentList from "./Components/DashboardPages/DpList";
import Help from "./pages/Help";
import AdminLogin from "./pages/AdminLogin";
import HelpAdmin from "./pages/HelpAdmin";
import ChangePassword from "./pages/ChangePassword";
import Invoice from "./pages/Invoice";
import Search from "./pages/Search";
import Util from "./pages/Utilization";
import Dep from "./pages/Depreciation";
import SideBar from "./Components/SideBar";
import Experiment from "./pages/ExperimentForm";
import Apparatus from "./pages/ApparatusForm";
import ExperimentList from "./Components/DashboardPages/ExperimentList";
import ApparatusList from "./Components/DashboardPages/ApparatusList";
import InvoiceList from "./Components/DashboardPages/InvoiceList";
function App() {
  return (
    <div className="App">
      <ToastContainer position="bottom-center" theme="dark" />

      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/Equipments_Issues" element={<Issue />} />
            <Route path="/Department_Info" element={<Departmentform />} />
            <Route path="/Equipments_Info" element={<EquipmentDetailsForm />} />
            <Route path="/Purchase_Details" element={<Purchase />} />
            <Route path="/Lab_Details" element={<LabInformation />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<SideBar />} />
            <Route path="/lablist" element={<Lablist />} />
            <Route path="/issueslist" element={<IssuesList />} />
            <Route path="/purchaselist" element={<PurchaseList />} />
            <Route path="/equipmentlist" element={<EquipmentList />} />
            <Route path="/departmentlist" element={<DepartmentList />} />
            <Route
              path="/equipmentreviewlist"
              element={<EquipmentsReviewList />}
            />
            <Route path="/Experiment_Form" element={<Experiment />} />
            <Route path="/Equipments_Review" element={<EquipmentsReview />} />
            <Route path="/help/incharge" element={<Help />} />
            <Route path="/help/admin" element={<HelpAdmin />} />
            <Route path="/changepassword" element={<ChangePassword />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/search" element={<Search />} />
            <Route path="/util" element={<Util />} />
            <Route path="/depreciation" element={<Dep />} />
            <Route path="/Apparatus_Details" element={<Apparatus />} />
          </Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/experimentlist" element={<ExperimentList />} />
          <Route path="/apparatuslist" element={<ApparatusList />} />
          <Route path="/invoicelist" element={<InvoiceList />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
