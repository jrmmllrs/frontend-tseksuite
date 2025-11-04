import {
  ChevronDown,
  LayoutDashboard,
  ChevronUp,
  Layers2,
  NotepadText,
  Package,
  ArrowUpNarrowWide,
  Captions,
  User,
  ClipboardList,
  BrickWall,
  CreditCard,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { NavLink } from "react-router-dom";

const AdminSideBar = () => {
  const [openApplicants, setOpenApplicants] = useState(false);
  const [openTrainings, setOpenTrainings] = useState(false);
  const [openAssessments, setOpenAssessments] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <div className="h-screen">
      <div className="h-full w-full max-w-[100px] sm:max-w-[200px] md:max-w-[200px] lg:max-w-[300px] flex flex-col gap-6 text-[#2E99B0] border-r-2 border-gray-300 shadow-2xl py-6 px-4 sm:px-6 items-center sm:items-start">
        {/* Header */}
        <div className="w-full flex items-center gap-3 sm:bg-[#2E99B0] rounded-full sm:rounded-3xl sm:px-3 sm:py-6">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden aspect-square">
            <img
              src="/assets/sampleImage.png"
              alt="Avatar"
              className="w-full h-full object-cover "
            />
          </div>
          <div className="hidden sm:flex flex-col gap-1">
            <div className="text-white text-sm font-semibold">Neil Pascual</div>
            <div className="h-px w-full bg-white opacity-30" />
            <div className="text-white text-xs font-light">
              Software Engineer
            </div>
          </div>
        </div>

        {/* Dashboard */}
        <div className="flex items-center gap-3 mt-10">
          <NavLink
            to="/admin/dashboard"
            replace
            className={({ isActive, isPending }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                isPending
                  ? "text-gray-400"
                  : isActive
                  ? "bg-[#E0F7FA] text-[#2E99B0] font-bold"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-lg">Dashboard</span>
          </NavLink>
        </div>

        {/* Applicants */}
        <div
          onClick={() => setOpenApplicants(!openApplicants)}
          className="flex items-center justify-center sm:justify-between w-full cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <span className="text-[#2E99B0] font-bold text-sm sm:text-base hidden sm:inline">
              Applicants
            </span>
          </div>
          {openApplicants ? (
            <ChevronUp className="h-5 w-5 hidden sm:inline" />
          ) : (
            <ChevronDown className="h-5 w-5 hidden sm:inline" />
          )}
        </div>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            openApplicants ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          } flex flex-col gap-2 sm:pl-6`}
        >
          <div className="flex items-center gap-2">
            <Layers2 className="h-4 w-4" />
            <span className="text-sm">Tests</span>
          </div>
          <div className="flex items-center gap-2">
            <NotepadText className="h-4 w-4" />
            <span className="text-sm">Results</span>
          </div>
        </div>

        {/* Trainings */}
        <div
          onClick={() => setOpenTrainings(!openTrainings)}
          className="flex items-center justify-center sm:justify-between w-full cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Captions className="h-5 w-5" />
            <span className="text-[#2E99B0] font-bold text-sm sm:text-base hidden sm:inline">
              Trainings
            </span>
          </div>
          {openTrainings ? (
            <ChevronUp className="h-5 w-5 hidden sm:inline" />
          ) : (
            <ChevronDown className="h-5 w-5 hidden sm:inline" />
          )}
        </div>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            openTrainings ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          } flex flex-col gap-2 sm:pl-6`}
        >
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="text-sm">Modules</span>
          </div>
          <div className="flex items-center gap-2">
            <NotepadText className="h-4 w-4" />
            <span className="text-sm">Tests</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpNarrowWide className="h-4 w-4" />
            <span className="text-sm">Progress</span>
          </div>
        </div>

        {/* Assessments */}
        <div
          onClick={() => setOpenAssessments(!openAssessments)}
          className="flex items-center justify-center sm:justify-between w-full cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            <span className="text-[#2E99B0] font-bold text-sm sm:text-base hidden sm:inline">
              Assessments
            </span>
          </div>
          {openAssessments ? (
            <ChevronUp className="h-5 w-5 hidden sm:inline" />
          ) : (
            <ChevronDown className="h-5 w-5 hidden sm:inline" />
          )}
        </div>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            openAssessments
              ? "max-h-[500px] opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-2"
          } flex flex-col gap-2 sm:pl-6`}
        >
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="text-sm">Test Bank</span>
          </div>
          <div className="flex items-center gap-2">
            <BrickWall className="h-4 w-4" />
            <span className="text-sm">Test Builder</span>
          </div>
        </div>

        {/* Logout */}
        <div
          className="w-[23%] h-[7%] rounded-xl bg-[#2E99B0] px-2 py-6 flex items-center gap-1 mt-25 fixed bottom-10 cursor-pointer"
          onClick={handleLogout}
        >
          <div className="ml-5">
            <img src="/assets/Logo.png" alt="Logo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSideBar;
