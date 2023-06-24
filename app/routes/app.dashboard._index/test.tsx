// {team.members.map((member) => (
//     <div
//       key={member.id}
//       className="flex justify-between flex-col md:flex-row items-start w-full"
//     >
//       <div className="p-2 flex gap-2 items-center border-zinc-700 ">
//         <div
//           className={` trasition-all duration-300 inline-flex group-hover:bg-indigo-500  ${
//             colorVariants[
//               Math.floor(Math.random() * (colorVariants.length - 1))
//             ]
//           } group-hover:text-zinc-200  child flex-shrink-0 items-center  justify-center h-12 w-12 overflow-hidden group-hover:border-indigo-500 border-zinc-500 rounded-xl lg:rounded-2xl  border dark:border-zinc-700`}
//         >
//           <span className=" text-xl ">mh</span>
//         </div>
//         <div className="   space-x-4 flex w-full  ">
//           <div className="flex flex-col justify-center">
//             <div className="text-lg font-semibold dark:text-zinc-100 items-center w-full justify-between inline-flex">
//               {member.firstName} {member.lastName}
//               {member.approved ? (
//                 <span className="bg-green-500 text-zinc-100 text-xs  p-[2px] px-2  rounded-full ml-auto ">
//                   Approved
//                 </span>
//               ) : (
//                 <span className="bg-red-500 text-zinc-100 text-xs p-[2px] px-2  rounded-full ml-2 ">
//                   Pending
//                 </span>
//               )}
//             </div>
//             <div className="text-md lg:text-base text-zinc-500">
//               {member.email}
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="flex  items-center p-2 justify-between w-full">
//         <div className=" flex justify-between w-full  gap-2">
//           {!member.approved ? (
//             <>
//               <button className=" border border-red-500 rounded-2xl text-sm md:text-base px-2 py-2 text-zinc-700 dark:text-zinc-100 hover:bg-red-300">
//                 Deny
//               </button>
//               <button className="border border-green-500 rounded-2xl text-sm md:text-base px-2 py-2 text-zinc-700 dark:text-zinc-100 hover:bg-green-300">
//                 Approve
//               </button>
//             </>
//           ) : (
//             <>
//               <button className=" border border-red-500 rounded-2xl text-sm md:text-sm h-10 px-2 py-2 text-zinc-700 dark:text-zinc-100 hover:bg-red-300">
//                 Remove User
//               </button>
//               <Popover>
//                 <PopoverTrigger asChild>
//   <Button
//     variant="outline"
//     className="ml-auto bg-zinc-100 dark:bg-zinc-900 rounded-2xl text-zinc-800 dark:text-zinc-200 border  border-zinc-300 dark:border-zinc-700 h-10"
//   >
//     Developer{" "}
//     <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
//   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="p-0" align="end">
//                   <Command className="bg-zinc-100 dark:bg-zinc-800">
//                     <CommandInput placeholder="Select new role..." />
//                     <CommandList>
//                       <CommandEmpty>No roles found.</CommandEmpty>
//                       <CommandGroup>
//                         <CommandItem
//                           onSelect={(v) => console.log(v)}
//                           className="teamaspace-y-1 flex flex-col items-start px-4 py-2"
//                         >
//                           <p>Viewer </p>
//                           <p className="text-sm text-muted-foreground">
//                             Can view and comment.
//                           </p>
//                         </CommandItem>
//                         <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
//                           <p>Developer</p>
//                           <p className="text-sm text-muted-foreground">
//                             Can view, comment and edit.
//                           </p>
//                         </CommandItem>
//                         <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
//                           <p>Billing</p>
//                           <p className="text-sm text-muted-foreground">
//                             Can view, comment and manage billing.
//                           </p>
//                         </CommandItem>
//                         <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
//                           <p>Owner</p>
//                           <p className="text-sm text-muted-foreground">
//                             Admin-level access to all resources.
//                           </p>
//                         </CommandItem>
//                       </CommandGroup>
//                     </CommandList>
//                   </Command>
//                 </PopoverContent>
//               </Popover>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   ))}

{
  /* <div className="w-full  flex flex-col gap-2  text-xl font-light text-zinc-200 rounded-2xl">
<div className="w-7/12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600  p-3 rounded-xl">
  <span className="font-bold">79</span> Breakfast
</div>
<div className="w-5/12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 p-3 rounded-xl">
  <span className="font-bold">52</span> Lunch
</div>
<div className="w-12/12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 p-3 rounded-xl">
  <span className="font-bold">157</span> Dinner
</div>
</div> */
}
