export type EmployeeStatus = "active" | "on_leave" | "inactive";

export type Employee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: EmployeeStatus;
  joinDate: string;
};

export const employees: Employee[] = [
  {
    id: "NV001",
    name: "Nguyễn Thị Lan",
    email: "lan.nguyen@tjcrm.com",
    phone: "0901 234 567",
    department: "Kinh doanh",
    role: "Trưởng phòng",
    status: "active",
    joinDate: "12/03/2022",
  },
  {
    id: "NV002",
    name: "Trần Văn Hùng",
    email: "hung.tran@tjcrm.com",
    phone: "0902 345 678",
    department: "Kỹ thuật",
    role: "Kỹ sư phần mềm",
    status: "active",
    joinDate: "04/07/2021",
  },
  {
    id: "NV003",
    name: "Lê Thị Mai",
    email: "mai.le@tjcrm.com",
    phone: "0903 456 789",
    department: "Marketing",
    role: "Chuyên viên nội dung",
    status: "on_leave",
    joinDate: "19/11/2023",
  },
  {
    id: "NV004",
    name: "Phạm Minh Đức",
    email: "duc.pham@tjcrm.com",
    phone: "0904 567 890",
    department: "Nhân sự",
    role: "Chuyên viên tuyển dụng",
    status: "active",
    joinDate: "02/01/2023",
  },
  {
    id: "NV005",
    name: "Hoàng Thị Thu",
    email: "thu.hoang@tjcrm.com",
    phone: "0905 678 901",
    department: "Kỹ thuật",
    role: "Kỹ sư QA",
    status: "active",
    joinDate: "15/05/2022",
  },
  {
    id: "NV006",
    name: "Vũ Đình Khánh",
    email: "khanh.vu@tjcrm.com",
    phone: "0906 789 012",
    department: "Vận hành",
    role: "Nhân viên vận hành",
    status: "inactive",
    joinDate: "28/08/2020",
  },
  {
    id: "NV007",
    name: "Đặng Thị Hồng",
    email: "hong.dang@tjcrm.com",
    phone: "0907 890 123",
    department: "Kinh doanh",
    role: "Chuyên viên kinh doanh",
    status: "active",
    joinDate: "09/09/2023",
  },
  {
    id: "NV008",
    name: "Bùi Quốc Anh",
    email: "anh.bui@tjcrm.com",
    phone: "0908 901 234",
    department: "Kỹ thuật",
    role: "Trưởng nhóm kỹ thuật",
    status: "active",
    joinDate: "21/02/2021",
  },
  {
    id: "NV009",
    name: "Ngô Thị Yến",
    email: "yen.ngo@tjcrm.com",
    phone: "0909 012 345",
    department: "Marketing",
    role: "Trưởng phòng",
    status: "active",
    joinDate: "30/06/2022",
  },
  {
    id: "NV010",
    name: "Lý Gia Bảo",
    email: "bao.ly@tjcrm.com",
    phone: "0910 123 456",
    department: "Nhân sự",
    role: "Trưởng phòng",
    status: "on_leave",
    joinDate: "14/04/2021",
  },
];

export const departments = Array.from(
  new Set(employees.map((e) => e.department))
);
