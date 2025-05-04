import { connectToDB } from "@/lib/mongodb";
import User from "@/lib/models/user";
import Group from "@/lib/models/groups";
import Link from "next/link";
import { auth0 } from "@/lib/auth0"; // ✅ adjust if your auth handler differs
import { SuggestButton } from "@/components/SuggestButton"; // ✅ adjust if your button is in a different path

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

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                {/* ✅ Back button */}
                <Link
                    href="/"
                    className="text-black cursor-pointer hover:scale-105 active:scale-95 duration-75 text-xl items-center flex mb-4 ml-2"
                >
                    <span className="inline-flex items-center gap-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            width="24"
                            height="24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Back
                    </span>
                </Link>

                {/* ✅ Alert if current user is missing tripPreferences */}
                {!currentUserHasPrefs && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded-md">
                        <p className="font-semibold mb-2">
                            You haven't submitted your trip preferences yet.
                        </p>
                        <Link
                            href="http://localhost:3000/preferences"
                            className="underline text-blue-600 hover:text-blue-800"
                        >
                            Go to Preferences →
                        </Link>
                    </div>
                )}

                <h1 className="text-3xl font-bold">{group.name}</h1>
                <p className="text-sm text-gray-600 mb-4">
                    Group ID: {group.groupId}
                </p>

                <p className="text-md mb-4">
                    <strong>Owner:</strong>{" "}
                    {owner?.name || owner?.email || "Not assigned"}
                </p>

                <h2 className="text-xl font-semibold mt-6">Members</h2>
                <ul className="list-disc ml-6 mt-2">
                    {users.map((user: any) => {
                        const hasTripPreferences =
                            user.tripPreferences &&
                            Object.keys(user.tripPreferences).length > 0;

                        return (
                            <li
                                key={user._id}
                                className="flex items-center gap-2"
                            >
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

                <div className="mt-6">
                    {/* <button
                        disabled={!allUsersReady}
                        className={`px-5 py-2 rounded-lg font-semibold duration-150 ${
                            allUsersReady
                                ? "bg-[#0f3857] text-white hover:bg-[#0d2f49] hover:scale-105"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        SUGGEST
                    </button> */}
                    <SuggestButton users={users} />
                    
                </div>
            </div>

            {/* Right: trip preferences per user */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Trip Preferences</h2>
                {users.map((user: any) => (
                    <div
                        key={user._id}
                        className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm"
                    >
                        <h3 className="font-semibold text-lg mb-2">
                            {user.name || user.email}
                        </h3>
                        {user.tripPreferences &&
                        Object.keys(user.tripPreferences).length > 0 ? (
                            <ul className="text-sm text-gray-700 space-y-1">
                                {Object.entries(user.tripPreferences).map(
                                    ([key, value]) => (
                                        <li key={key}>
                                            <strong>{key}:</strong>{" "}
                                            {Array.isArray(value)
                                                ? value.join(", ")
                                                : value?.toString()}
                                        </li>
                                    )
                                )}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic">
                                No preferences submitted
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
