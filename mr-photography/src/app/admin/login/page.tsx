// "use client"

// import { useState } from "react"
// import { signIn, getSession } from "next-auth/react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Eye, EyeOff, Loader2 } from "lucide-react"
// import Image from "next/image"

// export default function AdminLogin() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [error, setError] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const router = useRouter()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setError("")

//     try {
//       const result = await signIn("credentials", {
//         email,
//         password,
//         redirect: false,
//       })

//       if (result?.error) {
//         setError("Invalid email or password")
//       } else {
//         // Check if user is admin
//         const session = await getSession()
//         if (session?.user?.role === "ADMIN") {
//           router.push("/admin/dashboard")
//           router.refresh()
//         } else {
//           setError("Access denied. Admin privileges required.")
//         }
//       }
//     } catch (error) {
//       setError("An error occurred. Please try again.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
//       <div className="w-full max-w-md">
//         {/* Logo Section */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-gray-800 rounded-2xl mb-6 shadow-lg border border-gray-100 dark:border-gray-700">
//             {/* MR Logo */}
//             <div className="text-2xl font-light text-gray-800 dark:text-gray-200 tracking-wider">
//               <span className="font-thin">M</span>
//               <span className="font-thin">R</span>
//             </div>
//           </div>
//           <h1 className="text-3xl font-light text-gray-900 dark:text-white tracking-wide">
//             MR PHOTOGRAPHY
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm tracking-wide">
//             Admin Panel Access
//           </p>
//         </div>

//         {/* Login Form */}
//         <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
//           <CardHeader className="space-y-1 text-center pb-6">
//             <CardTitle className="text-2xl font-light tracking-wide">Welcome Back</CardTitle>
//             <CardDescription className="text-gray-600 dark:text-gray-400">
//               Sign in to access your admin dashboard
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <form onSubmit={handleSubmit} className="space-y-5">
//               {error && (
//                 <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
//                   <AlertDescription className="text-red-800 dark:text-red-400">
//                     {error}
//                   </AlertDescription>
//                 </Alert>
//               )}

//               <div className="space-y-2">
//                 <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
//                   Email Address
//                 </Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="Enter your email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   disabled={isLoading}
//                   className="h-12 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-gray-400 dark:focus:border-gray-500 transition-colors"
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
//                   Password
//                 </Label>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter your password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     disabled={isLoading}
//                     className="h-12 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-gray-400 dark:focus:border-gray-500 pr-12 transition-colors"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-5 w-5" />
//                     ) : (
//                       <Eye className="h-5 w-5" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full h-12 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-medium tracking-wide transition-all duration-200"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                     Signing In...
//                   </>
//                 ) : (
//                   "Sign In"
//                 )}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>

//         {/* Footer */}
//         <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
//           © 2024 MR PHOTOGRAPHY. All rights reserved.
//         </div>
//       </div>
//     </div>
//   )
// }




"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2, Camera, Lock, Mail } from "lucide-react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        // Check if user is admin
        const session = await getSession()
        if (session?.user?.role === "ADMIN") {
          router.push("/admin/dashboard")
          router.refresh()
        } else {
          setError("Access denied. Admin privileges required.")
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Beautiful Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-32 right-32 w-40 h-40 bg-purple-200/20 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-pink-200/25 rounded-full blur-xl animate-pulse delay-500" />
        <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-indigo-200/15 rounded-full blur-2xl animate-pulse delay-700" />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          
      

          {/* Login Card - Enhanced */}
          <Card className="relative overflow-hidden shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
            {/* Card Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-900/50" />
            
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-500/10 to-orange-500/10 rounded-full blur-xl" />
            
            <CardHeader className="relative z-10 space-y-1 text-center pb-8">
              <CardTitle className="text-2xl font-light tracking-wide text-gray-900 dark:text-white">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400 font-light">
                Sign in to access your admin dashboard
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert className="border-red-200 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm">
                    <AlertDescription className="text-red-800 dark:text-red-400">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Email Field */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Email Address</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="h-12 bg-white/70 dark:bg-gray-700/70 border-gray-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-500 transition-all duration-200 pl-12 backdrop-blur-sm"
                      required
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span>Password</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="h-12 bg-white/70 dark:bg-gray-700/70 border-gray-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-500 pl-12 pr-12 transition-all duration-200 backdrop-blur-sm"
                      required
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500 text-white font-medium tracking-wide transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <span>Sign In</span>
                      <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" />
                    </span>
                  )}
                </Button>
              </form>
              
              {/* Additional Features */}
              <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Secure Access</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300" />
                    <span>Protected</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer - Enhanced */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-500 dark:text-gray-400 font-light">
                © 2025 MR PHOTOGRAPHY
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}