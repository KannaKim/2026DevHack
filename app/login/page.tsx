// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
// import { Building2, User, Mail, Lock, Key, ArrowRight } from "lucide-react";
// import { useRouter } from "next/navigation";
// import clsx from "clsx";

// type TabType = "patient" | "clinic";
// type AuthMode = "login" | "register";

// export default function LoginPage() {
//   const [activeTab, setActiveTab] = useState<TabType>("patient");
//   const [authMode, setAuthMode] = useState<AuthMode>("login");

//   // Form state
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [clinicName, setClinicName] = useState("");

//   const isPatient = activeTab === "patient";
//   const isLogin = authMode === "login";
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       if (isLogin) {
//         console.log("Logging in as:", {
//           type: activeTab,
//           ...(isPatient ? { email } : { username }),
//           password,
//         });

//         // 🔐 Authentication (commented for now)
//         // await signIn(activeTab, isPatient ? email : username, password)

//         // Temporary redirect logic
//         if (activeTab === "patient") {
//           router.push("/dashboard"); // Using Next.js router for client-side navigation
//         } else {
//           router.push("/dashboard"); // Redirect to clinic dashboard
//         }
//       } else {
//         console.log("Registering as:", {
//           type: activeTab,
//           ...(isPatient ? { email } : { username, clinicName }),
//           password,
//         });

//         // 📝 Registration logic (commented for now)
//         // await register(activeTab, registrationData)

//         // Temporary redirect after register
//         if (activeTab === "patient") {
//           router.push("/dashboard");
//         } else {
//           router.push("/dashboard");
//         }
//       }
//     } catch (error) {
//       console.error("Auth error:", error);
//     }
//   };

//   const toggleMode = () => {
//     setAuthMode(isLogin ? "register" : "login");
//     // Clear form when switching modes
//     setEmail("");
//     setUsername("");
//     setPassword("");
//     setConfirmPassword("");
//     setClinicName("");
//   };

//   // const handleID = (e: React.MouseEvent<HTMLButtonElement>) => {
//   //   e.preventDefault();

//   //   console.log("Signing in with Gov ID as:", {
//   //     type: activeTab,
//   //   });

//   //   // Redirect to index.html
//   //   window.location.href =
//   //     "https://l0plqt3p-5500.usw2.devtunnels.ms/index.html";
//   // };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <Card className="w-full max-w-md shadow-2xl rounded-2xl border-0 overflow-hidden">
//         {/* Top Tabs with Icons */}
//         <div className="flex">
//           <button
//             onClick={() => {
//               setActiveTab("patient");
//               setAuthMode("login"); // Reset to login when switching tabs
//             }}
//             className={clsx(
//               "w-1/2 py-4 font-semibold flex items-center justify-center gap-2 transition-all duration-300",
//               activeTab === "patient"
//                 ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
//                 : "bg-gray-100 text-gray-600 hover:bg-gray-200",
//             )}
//           >
//             <User className="w-4 h-4" />
//             Patient
//           </button>

//           <button
//             onClick={() => {
//               setActiveTab("clinic");
//               setAuthMode("login"); // Reset to login when switching tabs
//             }}
//             className={clsx(
//               "w-1/2 py-4 font-semibold flex items-center justify-center gap-2 transition-all duration-300",
//               activeTab === "clinic"
//                 ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
//                 : "bg-gray-100 text-gray-600 hover:bg-gray-200",
//             )}
//           >
//             <Building2 className="w-4 h-4" />
//             Clinic
//           </button>
//         </div>

//         <CardContent className="p-8">
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//               {isLogin ? "Welcome Back" : "Create Account"}
//             </h2>
//             <p className="text-sm text-gray-500 mt-2">
//               {isLogin
//                 ? `Sign in to your ${activeTab} account`
//                 : `Register as a new ${activeTab}`}
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Dynamic fields based on tab and mode */}
//             {isLogin ? (
//               // LOGIN FIELDS
//               <>
//                 {isPatient ? (
//                   <div className="space-y-2 group">
//                     <Label className="text-gray-700 flex items-center gap-2">
//                       <Mail className="w-4 h-4 text-blue-600" />
//                       Email Address
//                     </Label>
//                     <Input
//                       type="email"
//                       placeholder="Enter your email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
//                       required
//                     />
//                   </div>
//                 ) : (
//                   <div className="space-y-2 group">
//                     <Label className="text-gray-700 flex items-center gap-2">
//                       <User className="w-4 h-4 text-blue-600" />
//                       Username
//                     </Label>
//                     <Input
//                       type="text"
//                       placeholder="Enter your username"
//                       value={username}
//                       onChange={(e) => setUsername(e.target.value)}
//                       className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
//                       required
//                     />
//                   </div>
//                 )}

//                 <div className="space-y-2">
//                   <Label className="text-gray-700 flex items-center gap-2">
//                     <Lock className="w-4 h-4 text-blue-600" />
//                     Password
//                   </Label>
//                   <Input
//                     type="password"
//                     placeholder="Enter your password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
//                     required
//                   />
//                 </div>

//                 <div className="text-right">
//                   <button
//                     type="button"
//                     className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-all"
//                   >
//                     Forgot password?
//                   </button>
//                 </div>
//               </>
//             ) : (
//               // REGISTRATION FIELDS
//               <>
//                 {isPatient ? (
//                   // Patient Registration
//                   <>
//                     <div className="space-y-2">
//                       <Label className="text-gray-700 flex items-center gap-2">
//                         <Mail className="w-4 h-4 text-blue-600" />
//                         Email Address
//                       </Label>
//                       <Input
//                         type="email"
//                         placeholder="Enter your email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
//                         required
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label className="text-gray-700 flex items-center gap-2">
//                         <User className="w-4 h-4 text-blue-600" />
//                         Full Name
//                       </Label>
//                       <Input
//                         type="text"
//                         placeholder="Enter your full name"
//                         className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
//                         required
//                       />
//                     </div>
//                   </>
//                 ) : (
//                   // Clinic Registration
//                   <>
//                     <div className="space-y-2">
//                       <Label className="text-gray-700 flex items-center gap-2">
//                         <Building2 className="w-4 h-4 text-blue-600" />
//                         Clinic Name
//                       </Label>
//                       <Input
//                         type="text"
//                         placeholder="Enter clinic name"
//                         value={clinicName}
//                         onChange={(e) => setClinicName(e.target.value)}
//                         className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
//                         required
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label className="text-gray-700 flex items-center gap-2">
//                         <User className="w-4 h-4 text-blue-600" />
//                         Username
//                       </Label>
//                       <Input
//                         type="text"
//                         placeholder="Choose a username"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
//                         required
//                       />
//                     </div>
//                   </>
//                 )}

//                 {/* Common registration fields */}
//                 <div className="space-y-2">
//                   <Label className="text-gray-700 flex items-center gap-2">
//                     <Lock className="w-4 h-4 text-blue-600" />
//                     Password
//                   </Label>
//                   <Input
//                     type="password"
//                     placeholder="Create a password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="text-gray-700 flex items-center gap-2">
//                     <Key className="w-4 h-4 text-blue-600" />
//                     Confirm Password
//                   </Label>
//                   <Input
//                     type="password"
//                     placeholder="Confirm your password"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     className={clsx(
//                       "border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all",
//                       confirmPassword &&
//                         password !== confirmPassword &&
//                         "border-red-500 focus:border-red-500",
//                     )}
//                     required
//                   />
//                   {confirmPassword && password !== confirmPassword && (
//                     <p className="text-xs text-red-500 mt-1">
//                       Passwords don't match
//                     </p>
//                   )}
//                 </div>
//               </>
//             )}

//             <Button
//               type="submit"
//               className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
//             >
//               {isLogin ? "Sign In" : "Create Account"}
//               <ArrowRight className="w-4 h-4 ml-2" />
//             </Button>
//             <Button
//               // onClick={handleID}
//               type="button"
//               className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
//             >
//               {"Sign In with Gov ID"}
//               <ArrowRight className="w-4 h-4 ml-2" />
//             </Button>

//             <div className="relative my-6">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-200"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-4 bg-white text-gray-500">
//                   {isLogin ? "New here?" : "Already have an account?"}
//                 </span>
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={toggleMode}
//               className="w-full text-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
//             >
//               <span className="font-medium text-blue-600 hover:text-blue-800 hover:underline">
//                 {isLogin ? "Create an account" : "Sign in to existing account"}
//               </span>
//             </button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
