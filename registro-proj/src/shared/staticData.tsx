import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ClassIcon from "@mui/icons-material/Class";
import AddTaskIcon from "@mui/icons-material/AddTask";
import PersonIcon from "@mui/icons-material/Person";
import type { AxiosError } from "axios";
import type { NavigateFunction } from "react-router-dom";

export type NavItem = {
  title: string;
  icon: React.ReactElement;
  to: string;
};

export const navItems: NavItem[] = [
  { title: "Home", icon: <HomeIcon />, to: "/home" },
  { title: "Dashboard", icon: <DashboardIcon />, to: "/dashboard" },
  { title: "Registro", icon: <ClassIcon />, to: "/class-register" },
  { title: "Nuova lezione", icon: <AddTaskIcon />, to: "/class-register/new" },
  { title: "Profilo", icon: <PersonIcon />, to: "/profile" },
];


export const navigateLandingPageIfNotAuth=(err: unknown, navigate:NavigateFunction):void=>{   
    const errAx= err as AxiosError<any>;
        if(errAx.response?.status===401){
          //mettere messaggio in rotellina in questo caso 
          navigate("/");
        }
  }
