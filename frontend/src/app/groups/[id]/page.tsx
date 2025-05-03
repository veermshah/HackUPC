// app/groups/[id]/page.tsx
import { connectDB } from "@/lib/mongoose";
import Group from "@/lib/models/Group";

export default async function GroupPage({
    params,
}: {
    params: { id: string };
}) {
    await connectDB();
    const group = await Group.findOne({ groupId: params.id }).lean();

    if (!group) return <p>Group not found</p>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
            <p className="text-gray-600 mb-4">Group ID: {group.groupId}</p>
            <h2 className="text-xl font-semibold">Members:</h2>
            <ul className="list-disc ml-6 mt-2">
                {group.members?.map((member: string) => (
                    <li key={member}>{member}</li>
                ))}
            </ul>
        </div>
    );
}
