import { connectToDB } from "@/lib/mongodb";
import User from "@/lib/models/user";
import Group from "@/lib/models/groups";

export default async function GroupMembers({
    params,
}: {
    params: { id: string };
}) {
    const groupId = params.id;
    await connectToDB();

    // Get group info
    const group = await Group.findOne({ groupId }).lean();

    if (!group) return <p>Group not found</p>;

    // Get users in the group
    const users = await User.find({ groups: groupId }).lean();

    // Find owner
    const owner = users.find((user) => user.isOwner);

    return (
        <div className="p-6">
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
                {users.map((user: any) => (
                    <li key={user._id}>{user.name || user.email}</li>
                ))}
            </ul>
        </div>
    );
}
