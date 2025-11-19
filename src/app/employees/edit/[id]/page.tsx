"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Link from "next/link";
import { EmployeeType } from "@/types/EmployeeType";
import { getEmployee, updateEmployee } from "@/query/employeesQuery";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Input from "@/components/ui/Input";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const initialState: EmployeeType = {
  fullName: "",
  email: "",
  dateOfBirth: "",
  dateOfStart: "",
  position: "",
  password: "",
  role: "",
};

export default function EditEmployee({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const route = useRouter();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [employee, setEmployee] = useState<EmployeeType>(initialState);

  // ✅ Fetch existing employee
  const {
    data: existingEmployee,
    isLoading,
    error,
  } = useQuery<EmployeeType>({
    queryKey: ["employee", id],
    queryFn: () => getEmployee(id),
    staleTime: 60000,
  });

  // ✅ Fill the form once the data is loaded
  useEffect(() => {
    if (existingEmployee) {
      // Format the dates correctly for <input type="date" />
      const formatted = {
        ...existingEmployee,
        dateOfBirth: existingEmployee.dateOfBirth
          ? existingEmployee.dateOfBirth.split("T")[0]
          : "",
        dateOfStart: existingEmployee.dateOfStart
          ? existingEmployee.dateOfStart.split("T")[0]
          : "",
      };
      setEmployee(formatted);
    }
  }, [existingEmployee]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  }

  // ✅ Mutation to update
  const updateEmployeeMutation = useMutation({
    mutationFn: (updatedEmployee: EmployeeType) =>
      updateEmployee({ id, updatedEmployee }),
    onSuccess: (data) => {
      toast.success(data.message || "Employee updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      route.push("/employees");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update employee");
      console.error("Error updating employee:", error);
    },
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (
      !employee.fullName.trim() ||
      !employee.position.trim() ||
      !employee.role
    )
      return;

    updateEmployeeMutation.mutate(employee);
  }

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return <p className="text-center text-red-500">Error loading employee.</p>;

  return (
    <div
      className="min-h-screen  py-6 px-2"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--text-primary)",
      }}
    >
      <div
        className="w-full mx-auto  max-w-2xl rounded-2xl shadow-2xl p-3 space-y-4 transition-all duration-300 "
        style={{
          backgroundColor: "var(--surface)",
          border: `1px solid var(--border)`,
        }}
      >
        <h1 className="text-3xl font-bold text-center mb-2 tracking-wide">
          Edit Employee
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Full Name */}
          <Input
            handleChange={handleChange}
            name="fullName"
            type="text"
            placeholder="Enter full name..."
            value={employee.fullName ?? ""}
            lable="Full Name"
            isRequired={true}
          />

          <Input
            handleChange={handleChange}
            name="email"
            type="email"
            placeholder="Enter Email..."
            value={employee.email ?? ""}
            lable="Email"
            isRequired={true}
          />
          {/* Email */}

          {/* Position */}
          <div className="space-y-2">
            <label className="block text-lg font-medium">
              Position <span className="text-red-500">*</span>
            </label>
            <select
              onChange={handleChange}
              value={employee.position ?? ""}
              required
              name="position"
              className="w-full px-4 py-3 rounded-xl outline-none text-base focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: "var(--background)",
                border: `1px solid var(--border)`,
                color: "var(--text-primary)",
              }}
            >
              <option value="">Select position</option>
              <option value="Manager">Manager</option>
              <option value="Mechanical Engineer">Mechanical Engineer</option>
              <option value="Electrical Engineer">Electrical Engineer</option>
              <option value="StoreKeeper">StoreKeeper</option>
              <option value="Production Operator">Production Operator</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              handleChange={handleChange}
              name="dateOfBirth"
              type="date"
              value={employee.dateOfBirth ?? ""}
              lable="Date of Birth"
              isRequired={false}
            />
            <Input
              handleChange={handleChange}
              name="dateOfStart"
              type="date"
              value={employee.dateOfStart ?? ""}
              lable="Start Date"
              isRequired={false}
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label className="block text-lg font-medium">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              onChange={handleChange}
              value={employee.role ?? ""}
              required
              name="role"
              className="w-full px-4 py-3 rounded-xl outline-none text-base focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: "var(--background)",
                border: `1px solid var(--border)`,
                color: "var(--text-primary)",
              }}
            >
              <option value="">Select role</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>

          <Input
            handleChange={handleChange}
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Entre Your Password..."
            value={employee.password ?? ""}
            lable="Password"
            isRequired={false}
          >
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: "10px",
                top: "64%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#555",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </Input>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <Link
              href={"/employees"}
              className="px-3 py-1 rounded-xl text-white font-semibold shadow hover:opacity-90 transition cursor-pointer"
              style={{
                backgroundColor: "var(--button-delete)",
                border: `1px solid var(--border)`,
              }}
            >
              Discard
            </Link>
            <button
              type="submit"
              className="px-3 py-1 rounded-xl text-white font-semibold shadow hover:opacity-90 transition cursor-pointer disabled:cursor-not-allowed"
              style={{
                backgroundColor: `var(--button-create)`,
                border: `1px solid var(--border)`,
              }}
            >
              {"Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
