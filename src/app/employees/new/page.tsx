"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addEmployee } from "@/query/employeesQuery";
import { toast } from "react-toastify";
import Link from "next/link";
import Input from "@/components/ui/Input";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const initialState = {
  fullName: "",
  email: "",
  dateOfBirth: "",
  dateOfStart: "",
  position: "",
  password: "",
  role: "",
};

export default function NewEmployee() {
  const route = useRouter();
  const [employee, setEmployee] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  }

  const addEmployeeMutation = useMutation({
    mutationFn: addEmployee,
    onSuccess: () => {
      // ✅ Refresh movements list
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
      // ✅ Reset fields
      setEmployee(initialState);

      // ✅ Redirect
      route.push("/employees");
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Failed to add employee:", error);
    },
  });

  // 🔹 Handle form submission
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (
      !employee.fullName.trim() ||
      !employee.position.trim() ||
      !employee.role
    )
      return;

    addEmployeeMutation.mutate(employee);
  }

  return (
    <div
      className="min-h-screen  py-6 px-2"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--text-primary)",
      }}
    >
      <Link href={"/employees"} className="underline text-green-600 ">
        &larr; Back
      </Link>
      <div
        className="w-full mx-auto  max-w-2xl rounded-2xl shadow-2xl p-3 space-y-4 transition-all duration-300 mt-3"
        style={{
          backgroundColor: "var(--surface)",
          border: `1px solid var(--border)`,
        }}
      >
        <h1 className="text-3xl font-bold text-center mb-2 tracking-wide">
          Create New Employee
        </h1>
        <p className="text-center text-md opacity-70 mb-6">
          The fields marked with <span className="text-red-500">*</span> are
          required.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Full Name */}
          <Input
            handleChange={handleChange}
            name="fullName"
            type="text"
            placeholder="Enter full name..."
            value={employee.fullName}
            lable="Full Name"
            isRequired={true}
          />
          <Input
            handleChange={handleChange}
            name="email"
            type="email"
            placeholder="Enter Email..."
            value={employee.email}
            lable="Email"
            isRequired={true}
          />

          {/* Position */}
          <div className="space-y-2">
            <label className="block text-lg font-medium">
              Position <span className="text-red-500">*</span>
            </label>
            <select
              onChange={handleChange}
              value={employee.position}
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
              value={employee.dateOfBirth}
              lable="Date of Birth"
              isRequired={false}
            />
            <Input
              handleChange={handleChange}
              name="dateOfStart"
              type="date"
              value={employee.dateOfStart}
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
              value={employee.role}
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
            value={employee.password}
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
            <button
              onClick={() => route.push("/employees")}
              type="button"
              className="px-3 py-1 rounded text-white font-semibold shadow hover:opacity-90 transition cursor-pointer"
              style={{
                backgroundColor: "var(--button-delete)",
                border: `1px solid var(--border)`,
              }}
            >
              Discard
            </button>
            <button
              disabled={addEmployeeMutation.isPending}
              type="submit"
              className="px-3 py-1 rounded text-white font-semibold shadow hover:opacity-90 transition cursor-pointer disabled:cursor-not-allowed"
              style={{
                backgroundColor: `var(--button-create)`,
                border: `1px solid var(--border)`,
              }}
            >
              {addEmployeeMutation.isPending ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
