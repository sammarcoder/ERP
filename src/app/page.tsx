// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
//       <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
//           <li className="mb-2 tracking-[-.01em]">
//             Get started by editing{" "}
//             <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
//               src/app/page.tsx
//             </code>
//             .
//           </li>
//           <li className="tracking-[-.01em]">
//             Save and see your changes instantly.
//           </li>
//         </ol>

//         <div className="flex gap-4 items-center flex-col sm:flex-row">
//           <a
//             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }













// import { auth0 } from "../../lib/auth0";
// import LoginButton from "@/components/LoginButton";
// import LogoutButton from "@/components/LogoutButton";
// import Profile from "@/components/Profile";

// export default async function Home() {
//   const session = await auth0.getSession();
//   const user = session?.user;

//   return (
//     <div className="app-container">
//       <div className="main-card-wrapper">
//         <img
//           src="https://cdn.auth0.com/website/auth0-logo-dark.svg"
//           alt="Auth0 Logo"
//           className="auth0-logo"
//         />
//         <h1 className="main-title">Next.js + Auth0</h1>
        
//         <div className="action-card">
//           {user ? (
//             <div className="logged-in-section">
//               <p className="logged-in-message">✅ Successfully logged in!</p>
//               <Profile />
//               <LogoutButton />
//             </div>
//           ) : (
//             <>
//               <p className="action-text">
//                 Welcome! Please log in to access your protected content.
//               </p>
//               <LoginButton />
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }






























// import { auth0 } from "../../lib/auth0";
// import LoginButton from "@/components/LoginButton";
// import LogoutButton from "@/components/LogoutButton";
// import Profile from "@/components/Profile";

// export default async function Home() {
//   const session = await auth0.getSession();
//   const user = session?.user;

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
        
//         <img
//           src="https://cdn.auth0.com/website/auth0-logo-dark.svg"
//           alt="Auth0 Logo"
//           className="w-24 h-auto mx-auto mb-6"
//         />
        
//         <h1 className="text-2xl font-bold text-gray-900 mb-8">
//           Next.js + Auth0
//         </h1>
        
//         <div className="action-card">
//           {user ? (
//             <div className="space-y-6">
//               <p className="text-[#4c96dc] font-semibold text-lg">
//                 ✅ Successfully logged in!
//               </p>
              
//               <Profile />
//               <LogoutButton />
//             </div>
//           ) : (
//             <div className="space-y-6">
//               <p className="text-gray-600">
//                 Welcome! Please log in to access your protected content.
//               </p>
              
//               <LoginButton />
//             </div>
//           )}
//         </div>
        
//       </div>
//     </div>
//   );
// }




























// keycloack





// import { auth, signIn } from "../../auth"
// import { redirect } from "next/navigation"

export default async function LoginPage() {
  // const session = await auth()
  
  // if (session) {
  //   redirect('/dashboard')
  // }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ERP System Login
          </h2>
          {/* <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in with your Keycloak account
          </p> */}
        </div>
        
        {/* <div className="mt-8 space-y-6">
          <form
            action={async () => {
              "use server"
              await signIn("keycloak", { redirectTo: "/dashboard" })
            }}
          >
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in with Keycloak
            </button>
          </form>
        </div> */}
      </div>
    </div>
  )
}






