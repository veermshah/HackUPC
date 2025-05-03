import { auth0 } from "@/lib/auth0";
import "./globals.css";
import { connectToDB } from "@/lib/mongodb";
import User from "@/lib/models/user";
import Group from "@/lib/models/groups";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import CreateGroupButton from "@/components/CreateGroupButton";
import GroupList from "@/components/GroupList";
import { cookies } from "next/headers";



// export default async function Home() {
//     const session = await auth0.getSession();
//     let userGroups: any[] = [];

//     if (session) {
//         await connectToDB();
//         let existingUser = await User.findOne({ auth0Id: session.user.sub });

//         if (!existingUser) {
//             existingUser = await User.create({
//                 auth0Id: session.user.sub,
//                 email: session.user.email,
//                 name: session.user.name,
//             });
//         }

//         if (existingUser.groups && existingUser.groups.length > 0) {
//             userGroups = await Group.find({ groupId: { $in: existingUser.groups } });
//         }
//     }

//     async function createGroup(formData: FormData) {
//         "use server";
//         const name = formData.get("groupName")?.toString();
//         if (!name || !session) return;

//         await connectToDB();

//         const newGroupId = uuidv4();
//         await Group.create({
//             groupId: newGroupId,
//             name,
//             createdAt: new Date(),
//         });

//         await User.findOneAndUpdate(
//             { auth0Id: session.user.sub },
//             {
//                 $addToSet: { groups: newGroupId },
//                 $set: { isOwner: true },
//             }
//         );

//         revalidatePath("/");
//         redirect("/");
//     }

//     return (
//         <main
//             className="min-h-screen bg-cover bg-center bg-no-repeat"
//             style={{ backgroundImage: "url('/background.jpg')" }}
//         >
//             <nav className="fixed top-6 left-0 right-0 mx-4 flex items-center justify-between px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border-2 border-black/10 shadow-lg z-10">
//                 <div className="flex items-center space-x-4">
//                     <a
//                         href="/"
//                         className="text-3xl font-black text-[#0f3857] cursor-pointer hover:scale-110 active:scale-95 duration-75"
//                     >
//                         Scanner
//                     </a>
//                     {session && <CreateGroupButton action={createGroup} />}
//                 </div>

//                 <div className="space-x-4">
//                     {!session ? (
//                         <>
//                             <a href="/auth/login?screen_hint=signup">
//                                 <button className="px-4 py-2 bg-[#0f3857] text-white hover:bg-[#0f3857] hover:scale-110 active:scale-95 cursor-pointer rounded-xl duration-75">
//                                     Sign up
//                                 </button>
//                             </a>
//                             <a href="/auth/login">
//                                 <button className="px-4 py-2 bg-gray-300 text-[#0f3857] hover:text-[#c0dedf] hover:bg-[#0f3857] rounded-xl hover:scale-110 active:scale-95 cursor-pointer duration-75">
//                                     Log in
//                                 </button>
//                             </a>
//                         </>
//                     ) : (
//                         <>
//                             <span className="text-white text-lg font-semibold">
//                                 Welcome, {session.user.name ?? "User"}!
//                             </span>
//                             <a href="/auth/logout">
//                                 <button className="px-4 py-2 bg-[#c0dedf] text-black hover:text-[#c0dedf] hover:bg-[#0f3857] hover:scale-110 active:scale-95 cursor-pointer rounded-xl duration-75">
//                                     Log out
//                                 </button>
//                             </a>
//                         </>
//                     )}
//                 </div>
//             </nav>

//             <div className="pt-[120px] px-8">
//                 <h2 className="text-2xl font-bold mb-4 text-black">Groups</h2>
//                 <GroupList groups={userGroups} />
//             </div>
//         </main>
//     );
// }


export default async function Home() {
    const session = await auth0.getSession();
    const cookieStore = await cookies();
    const invitedGroupId = cookieStore.get("invitedGroupId")?.value;    
    let userGroups: any[] = [];
  
    if (session) {
      await connectToDB();
      let existingUser = await User.findOne({ auth0Id: session.user.sub });
  
      if (!existingUser && invitedGroupId) {
        existingUser = await User.create({
          auth0Id: session.user.sub,
          email: session.user.email,
          name: session.user.name,
          groups: [invitedGroupId],
        });
        cookieStore.set("invitedGroupId", "", { maxAge: 0 });
      } else if (existingUser && invitedGroupId) {
        await User.findOneAndUpdate(
          { auth0Id: session.user.sub },
          { $addToSet: { groups: invitedGroupId } }
        );
        cookieStore.set("invitedGroupId", "", { maxAge: 0 });
      }
  
      if (existingUser?.groups?.length > 0) {
        userGroups = await Group.find({
          groupId: { $in: existingUser.groups },
        });
      }
    }
  
    async function createGroup(formData: FormData) {
      "use server";
      const name = formData.get("groupName")?.toString();
      if (!name || !session) return;
  
      await connectToDB();
  
      const newGroupId = uuidv4();
      await Group.create({
        groupId: newGroupId,
        name,
        createdAt: new Date(),
      });
  
      await User.findOneAndUpdate(
        { auth0Id: session.user.sub },
        {
          $addToSet: { groups: newGroupId },
          $set: { isOwner: true },
        }
      );
  
      revalidatePath("/");
      redirect("/");
    }
  
    return (
      <main
        className="min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/background.jpg')" }}
      >
        <nav className="fixed top-6 left-0 right-0 mx-4 flex items-center justify-between px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border-2 border-black/10 shadow-lg z-10">
          <div className="flex items-center space-x-4">
            <a
              href="/"
              className="text-3xl font-black text-[#0f3857] cursor-pointer hover:scale-110 active:scale-95 duration-75"
            >
              Scanner
            </a>
            {session && <CreateGroupButton action={createGroup} />}
          </div>
  
          <div className="space-x-4">
            {!session ? (
              <>
                <a href="/auth/login?screen_hint=signup">
                  <button className="px-4 py-2 bg-[#0f3857] text-white hover:bg-[#0f3857] hover:scale-110 active:scale-95 cursor-pointer rounded-xl duration-75">
                    Sign up
                  </button>
                </a>
                <a href="/auth/login">
                  <button className="px-4 py-2 bg-gray-300 text-[#0f3857] hover:text-[#c0dedf] hover:bg-[#0f3857] rounded-xl hover:scale-110 active:scale-95 cursor-pointer duration-75">
                    Log in
                  </button>
                </a>
              </>
            ) : (
              <>
                <span className="text-white text-lg font-semibold">
                  Welcome, {session.user.name ?? "User"}!
                </span>
                <a href="/auth/logout">
                  <button className="px-4 py-2 bg-[#c0dedf] text-black hover:text-[#c0dedf] hover:bg-[#0f3857] hover:scale-110 active:scale-95 cursor-pointer rounded-xl duration-75">
                    Log out
                  </button>
                </a>
              </>
            )}
          </div>
        </nav>
  
        <div className="pt-[120px] px-8">
          <h2 className="text-2xl font-bold mb-4 text-black">Groups</h2>
          <GroupList groups={userGroups} />
        </div>
      </main>
    );
  }