// import { connectToDB } from "@/lib/mongodb";
// import User from "@/lib/models/user";
// import Group from "@/lib/models/groups";
// import Link from "next/link";
// import { auth0 } from "@/lib/auth0";
// import { SuggestButton } from "@/components/SuggestButton";
// import Navbar from "@/components/Navbar";
// import { v4 as uuidv4 } from "uuid";
// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";

// export default async function GroupMembers({
//     params,
// }: {
//     params: { id: string };
// }) {
//     await connectToDB();

//     const session = await auth0.getSession();
//     const currentAuth0Id = session?.user?.sub;

//     const group = await Group.findOne({ groupId: params.id }).lean();
//     if (!group) return <p>Group not found</p>;

//     const users = await User.find({ groups: params.id }).lean();
//     const currentUser = users.find((u) => u.auth0Id === currentAuth0Id);
//     const owner = users.find((user) => user.isOwner);

//     const allUsersReady = users.every(
//         (user: any) =>
//             user.tripPreferences && Object.keys(user.tripPreferences).length > 0
//     );

//     const currentUserHasPrefs =
//         currentUser?.tripPreferences &&
//         Object.keys(currentUser.tripPreferences).length > 0;

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
//         <main className="min-h-screen bg-cover bg-center bg-no-repeat">
//             <Navbar session={session} createGroup={createGroup} />

//             <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 mt-28">


//                 <div className="p-6 border rounded-xl shadow-md bg-white w-fit h-fit space-y-6 ml-20">
//                     {/* Título */}
//                     <h1 className="text-3xl font-bold text-[#0f3857]">{group.name}</h1>

//                     {/* Group ID */}
//                     <p className="text-sm text-gray-500">
//                         <strong>Group ID:</strong>{group.groupId}
//                     </p>

//                     {/* Owner */}
//                     <div className="border border-[#0f3857] bg-[#f0faff] rounded-lg p-4">
//                         <p className="text-md font-medium text-[#0f3857]">
//                             <strong>Owner:</strong>{" "}
//                             {owner?.name || owner?.email || "Not assigned"}
//                         </p>
//                     </div>

//                     {/* Members */}
//                     <div className="border border-[#0f3857] bg-[#f8f9fa] rounded-lg p-4">
//                         <h2 className="text-lg font-semibold text-[#0f3857] mb-2">Members</h2>
//                         <ul className="space-y-1 text-gray-700 text-sm">
//                             {users.map((user: any) => {
//                                 const hasTripPreferences =
//                                     user.tripPreferences &&
//                                     Object.keys(user.tripPreferences).length > 0;

//                                 return (
//                                     <li
//                                         key={user._id}
//                                         className="flex items-center gap-2"
//                                     >
//                                         {user.name || user.email}
//                                         {hasTripPreferences && (
//                                             <span
//                                                 title="Submitted trip preferences"
//                                                 className="text-green-600"
//                                             >
//                                                 ✅
//                                             </span>
//                                         )}
//                                     </li>
//                                 );
//                             })}
//                         </ul>
//                     </div>

//                     {/* SUGGEST Button */}
//                     <SuggestButton users={users} />
//                 </div>

//                 {!currentUserHasPrefs && (
//                         <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded-md">
//                             <p className="font-semibold mb-2">
//                                 You haven't submitted your trip preferences yet.
//                             </p>
//                             <Link
//                                 href="/preferences"
//                                 className="underline text-blue-600 hover:text-blue-800"
//                             >
//                                 Go to Preferences →
//                             </Link>
//                         </div>
//                 )}

//                 <div className="p-6 border flex rounded-xl shadow-md bg-white w-fit h-fit space-y-6 ml-20">
//                     <h2 className="text-xl font-semibold mb-4">Trip Preferences</h2><br></br>
//                     {users.map((user: any) => ( 
//                         <div
//                             key={user._id}
//                             className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm"
//                         >
//                             <h3 className="font-semibold text-lg mb-2">
//                                 {user.name || user.email}
//                             </h3>
//                             {user.tripPreferences &&
//                             Object.keys(user.tripPreferences).length > 0 ? (
//                                 <ul className="text-sm text-gray-700 space-y-1">
//                                     {Object.entries(user.tripPreferences).map(
//                                         ([key, value]) => (
//                                             <li key={key}>
//                                                 <strong>{key}:</strong>{" "}
//                                                 {Array.isArray(value)
//                                                     ? value.join(", ")
//                                                     : value?.toString()}
//                                             </li>
//                                         )
//                                     )}
//                                 </ul>
//                             ) : (
//                                 <p className="text-gray-500 italic">
//                                     No preferences submitted
//                                 </p>
//                             )}
//                         </div>
//                     ))}
//                 </div>

                
//             </div>
//         </main>
//     );
// }





import { connectToDB } from "@/lib/mongodb";
import User from "@/lib/models/user";
import Group from "@/lib/models/groups";
import Link from "next/link";
import { auth0 } from "@/lib/auth0";
import { SuggestButton } from "@/components/SuggestButton";
import Navbar from "@/components/Navbar";
import AIChat from "@/components/AIChat";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function GroupMembers({
    params,
}: {
    params: { id: string };
}) {
    await connectToDB();

    const session = await auth0.getSession();
    const currentAuth0Id = session?.user?.sub;

    const group = await Group.findOne({ groupId: params.id }).lean();
    if (!group) return <p>Group not found</p>;

    const users = await User.find({ groups: params.id }).lean();
    const currentUser = users.find((u) => u.auth0Id === currentAuth0Id);
    const owner = users.find((user) => user.isOwner);

    const allUsersReady = users.every(
        (user: any) =>
            user.tripPreferences && Object.keys(user.tripPreferences).length > 0
    );

    const currentUserHasPrefs =
        currentUser?.tripPreferences &&
        Object.keys(currentUser.tripPreferences).length > 0;

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
        <main className="min-h-screen bg-cover bg-center bg-no-repeat">
            <Navbar session={session} createGroup={createGroup} />

            <div className=" flex flex-col items-center text-center">

                <div className="px-10 py-6 grid grid-cols-1 lg:grid-cols-[minmax(350px,400px)_1fr] gap-8 mt-28 items-start">
                    {/* Left Column: Group Info */}
                    <div className="p-6 border rounded-xl shadow-md bg-white w-fill h-fit space-y-6">
                        <h1 className="text-3xl font-bold text-[#0f3857]">{group.name}</h1>
                        <p className="text-sm text-gray-500">
                            <strong>Group ID:</strong> {group.groupId}
                        </p>
                        <div className="border border-[#0f3857] bg-[#f0faff] rounded-lg p-4">
                            <p className="text-md font-medium text-[#0f3857]">
                                <strong>Owner:</strong> {owner?.name || owner?.email || "Not assigned"}
                            </p>
                        </div>
                        <div className="border border-[#0f3857] bg-[#f8f9fa] rounded-lg p-4">
                            <h2 className="text-lg font-semibold text-[#0f3857] mb-2">Members</h2>
                            <ul className="space-y-1 text-gray-700 text-sm">
                                {users.map((user: any) => {
                                    const hasTripPreferences =
                                        user.tripPreferences &&
                                        Object.keys(user.tripPreferences).length > 0;
                                    return (
                                        <li key={user._id} className="flex items-center gap-2">
                                            {user.name || user.email}
                                            {hasTripPreferences && (
                                                <span
                                                    title="Submitted trip preferences"
                                                    className="text-green-600 text-lg"
                                                >
                                                    ✅
                                                </span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <SuggestButton users={users} />
                    </div>

                    {/* Right Column: Trip Preferences & Chat */}
                    <div className="flex flex-col gap-8">
                        {!currentUserHasPrefs && (
                            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md">
                                <p className="font-semibold mb-2">
                                    You haven't submitted your trip preferences yet.
                                </p>
                                <Link
                                    href="/preferences"
                                    className="underline text-blue-600 hover:text-blue-800"
                                >
                                    Go to Preferences →
                                </Link>
                            </div>
                        )}

                        <div className="p-6 border rounded-xl shadow-md bg-white w-fill h-fit">
                            <h2 className="text-2xl font-bold text-[#0f3857] border-b pb-2 mb-6">Trip Preferences</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-start font-mono text-sm bg-gray-50 p-4 rounded-lg">
    {users.map((user: any) => (
        <details
            key={user._id}
            className="border border-gray-200 rounded-md bg-white p-3 open:shadow-md"
        >
            <summary className="cursor-pointer select-none font-bold text-[#0f3857] hover:text-blue-600">
                {user.name || user.email}
            </summary>
            <div className="p-3 border-t mt-2 text-gray-800">
                {user.tripPreferences && Object.keys(user.tripPreferences).length > 0 ? (
                    <pre className="whitespace-pre-wrap text-xs leading-relaxed">
{`{
${Object.entries(user.tripPreferences)
    .map(([key, value]) => {
        const formattedValue = Array.isArray(value)
            ? `[${value.map(v => `"${v}"`).join(", ")}]`
            : `"${value}"`;
        return `  "${key}": ${formattedValue}`;
    })
    .join(",\n")}
}`}
                    </pre>
                ) : (
                    <p className="italic text-gray-500">No preferences submitted</p>
                )}
            </div>
        </details>
    ))}
</div>

                        </div>

                        <div className="p-6 border rounded-xl shadow-md bg-white w-fill text-start">
                            <h2 className="text-xl font-semibold text-[#0f3857] mb-4">Ask Mr. MidPoint</h2>
                            <AIChat />
                        </div>
                    </div>
                </div>

            </div>

            
        </main>
    );
}





// import { connectToDB } from "@/lib/mongodb";
// import User from "@/lib/models/user";
// import Group from "@/lib/models/groups";
// import Link from "next/link";
// import { auth0 } from "@/lib/auth0";
// import { SuggestButton } from "@/components/SuggestButton";
// import Navbar from "@/components/Navbar";
// import { v4 as uuidv4 } from "uuid";
// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";

// export default async function GroupMembers({
//     params,
// }: {
//     params: { id: string };
// }) {
//     await connectToDB();

//     const session = await auth0.getSession();
//     const currentAuth0Id = session?.user?.sub;

//     const group = await Group.findOne({ groupId: params.id }).lean();
//     if (!group) return <p>Group not found</p>;

//     const users = await User.find({ groups: params.id }).lean();
//     const currentUser = users.find((u) => u.auth0Id === currentAuth0Id);
//     const owner = users.find((user) => user.isOwner);

//     const allUsersReady = users.every(
//         (user: any) =>
//             user.tripPreferences && Object.keys(user.tripPreferences).length > 0
//     );

//     const currentUserHasPrefs =
//         currentUser?.tripPreferences &&
//         Object.keys(currentUser.tripPreferences).length > 0;

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
//         <main className="min-h-screen bg-cover bg-center bg-no-repeat">
//             <Navbar session={session} createGroup={createGroup} />

//             <div className="p-6 grid grid-cols-2 gap-2 mt-28">
//                 <div className="p-6 border rounded-xl shadow-md bg-white w-fit h-fit space-y-6 ml-20">
//                     <h1 className="text-3xl font-bold text-[#0f3857]">{group.name}</h1>
//                     <p className="text-sm text-gray-500">
//                         <strong>Group ID:</strong> {group.groupId}
//                     </p>
//                         <div className="border border-[#0f3857] bg-[#f0faff] rounded-lg p-4">
//                             <p className="text-md font-medium text-[#0f3857]">
//                             <strong>Owner:</strong> {owner?.name || owner?.email || "Not assigned"}
//                         </p>
//                     </div>
//                     <div className="border border-[#0f3857] bg-[#f8f9fa] rounded-lg p-4">
//                         <h2 className="text-lg font-semibold text-[#0f3857] mb-2">Members</h2>
//                         <ul className="space-y-1 text-gray-700 text-sm">
//                             {users.map((user: any) => {
//                                 const hasTripPreferences =
//                                     user.tripPreferences &&
//                                     Object.keys(user.tripPreferences).length > 0;
//                                 return (
//                                     <li key={user._id} className="flex items-center gap-2">
//                                         {user.name || user.email}
//                                         {hasTripPreferences && (
//                                             <span
//                                                 title="Submitted trip preferences"
//                                                 className="text-green-600 text-lg"
//                                             >
//                                                 ✅
//                                             </span>
//                                         )}
//                                     </li>
//                                 );
//                             })}
//                         </ul>
//                     </div>
//                     <SuggestButton users={users} />
//                 </div>

//                 {!currentUserHasPrefs && (
//                     <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded-md">
//                         <p className="font-semibold mb-2">
//                             You haven't submitted your trip preferences yet.
//                         </p>
//                         <Link
//                             href="/preferences"
//                             className="underline text-blue-600 hover:text-blue-800"
//                         >
//                             Go to Preferences →
//                         </Link>
//                     </div>
//                 )}

//                 <div className="p-6 border rounded-xl shadow-md bg-white w-fit h-fit">
//                     <h2 className="text-2xl font-bold text-[#0f3857] border-b pb-2 mb-6">Trip Preferences</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {users.map((user: any, index: number) => (
//                             <details
//                                 key={user._id}
//                                 className="border border-gray-200 rounded-lg shadow-sm open:shadow-lg transition duration-200 overflow-hidden"
//                             >
//                                 <summary className="cursor-pointer select-none p-4 font-semibold text-[#0f3857] hover:bg-gray-100">
//                                     {user.name || user.email}
//                                 </summary>
//                                 <div className="p-4 border-t text-sm text-gray-700">
//                                     {user.tripPreferences && Object.keys(user.tripPreferences).length > 0 ? (
//                                         <ul className="space-y-1">
//                                             {Object.entries(user.tripPreferences).map(([key, value]) => (
//                                                 <li key={key}>
//                                                     <strong>{key}:</strong> {Array.isArray(value) ? value.join(", ") : value?.toString()}
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     ) : (
//                                         <p className="italic text-gray-500">
//                                             No preferences submitted
//                                         </p>
//                                     )}
//                                 </div>
//                             </details>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </main>
//     );
// }
