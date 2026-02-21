"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, User, Mail, Lock, Key, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

type TabType = "patient" | "clinic";
type AuthMode = "login" | "register";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<TabType>("patient");
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  // Form state
  const [phin, setPhin] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clinicName, setClinicName] = useState("");

  const isPatient = activeTab === "patient";
  const isLogin = authMode === "login";
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        if (activeTab === "patient") {
          const res = await fetch("/api/auth/patient/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phin,
              password,
            }),
          });

          const data = await res.json();

          if (!data.success) {
            alert(data.message);
            return;
          }

          router.push("/dashboard");
        } else {
          const res = await fetch("/api/auth/clinic/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              clinicId: username,
              password,
            }),
          });

          const data = await res.json();

          if (!data.success) {
            alert(data.message);
            return;
          }

          router.push("/clinic");
        }
      } else {
        // Registration
        if (activeTab === "patient") {
          const res = await fetch("/api/auth/patient/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phin,
              password,
              name: username,
              dob: "2000-01-01", // replace with real state later
              conditions: [],
            }),
          });

          const data = await res.json();
          if (!data.success) {
            alert(data.message);
            return;
          }

          router.push("/dashboard");
        } else {
          const res = await fetch("/api/auth/clinic/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              clinicId: username,
              password,
              name: clinicName,
            }),
          });

          const data = await res.json();
          if (!data.success) {
            alert(data.message);
            return;
          }

          router.push("/clinic");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleMode = () => {
    setAuthMode(isLogin ? "register" : "login");
    // Clear form when switching modes
    setPhin("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setClinicName("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl border-0 overflow-hidden">
        {/* Top Tabs with Icons */}
        <div className="flex">
          <button
            onClick={() => {
              setActiveTab("patient");
              setAuthMode("login"); // Reset to login when switching tabs
            }}
            className={clsx(
              "w-1/2 py-4 font-semibold flex items-center justify-center gap-2 transition-all duration-300",
              activeTab === "patient"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            )}
          >
            <User className="w-4 h-4" />
            Patient
          </button>

          <button
            onClick={() => {
              setActiveTab("clinic");
              setAuthMode("login"); // Reset to login when switching tabs
            }}
            className={clsx(
              "w-1/2 py-4 font-semibold flex items-center justify-center gap-2 transition-all duration-300",
              activeTab === "clinic"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            )}
          >
            <Building2 className="w-4 h-4" />
            Clinic
          </button>
        </div>

        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {isLogin
                ? `Sign in to your ${activeTab} account`
                : `Register as a new ${activeTab}`}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Dynamic fields based on tab and mode */}
            {isLogin ? (
              // LOGIN FIELDS
              <>
                {isPatient ? (
                  <div className="space-y-2 group">
                    <Label className="text-gray-700 flex items-center gap-2">
                      <Key className="w-4 h-4 text-blue-600" />
                      PHIN (9-digit Manitoba Health ID)
                    </Label>
                    <Input
                      type="text"
                      placeholder="Enter your PHIN"
                      value={phin}
                      onChange={(e) => setPhin(e.target.value)}
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
                      required
                    />
                  </div>
                ) : (
                  <div className="space-y-2 group">
                    <Label className="text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      Clinic ID
                    </Label>
                    <Input
                      type="text"
                      placeholder="Enter your Clinic ID"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-gray-700 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-600" />
                    Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-all"
                  >
                    Forgot password?
                  </button>
                </div>
              </>
            ) : (
              // REGISTRATION FIELDS
              <>
                {isPatient ? (
                  // Patient Registration
                  <>
                    <div className="space-y-2 group">
                      <Label className="text-gray-700 flex items-center gap-2">
                        <Key className="w-4 h-4 text-blue-600" />
                        PHIN (9-digit Manitoba Health ID)
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter your PHIN"
                        value={phin}
                        onChange={(e) => setPhin(e.target.value)}
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
                        required
                      />
                      <div className="space-y-2">
                        <Label>Date of Birth</Label>
                        <Input type="date" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600" />
                        Full Name
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter your full name"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
                        required
                      />
                    </div>
                  </>
                ) : (
                  // Clinic Registration
                  <>
                    <div className="space-y-2">
                      <Label className="text-gray-700 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        Clinic Name
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter clinic name"
                        value={clinicName}
                        onChange={(e) => setClinicName(e.target.value)}
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600" />
                        Clinic ID
                      </Label>
                      <Input
                        type="text"
                        placeholder="Provide your Clinic ID"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
                        required
                      />
                    </div>
                  </>
                )}

                {/* Common registration fields */}
                <div className="space-y-2">
                  <Label className="text-gray-700 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-600" />
                    Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 flex items-center gap-2">
                    <Key className="w-4 h-4 text-blue-600" />
                    Confirm Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={clsx(
                      "border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all",
                      confirmPassword &&
                        password !== confirmPassword &&
                        "border-red-500 focus:border-red-500",
                    )}
                    required
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">
                      Passwords don't match
                    </p>
                  )}
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              {isLogin ? "Sign In" : "Create Account"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  {isLogin ? "New here?" : "Already have an account?"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleMode}
              className="w-full text-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <span className="font-medium text-blue-600 hover:text-blue-800 hover:underline">
                {isLogin ? "Create an account" : "Sign in to existing account"}
              </span>
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
