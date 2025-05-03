"use client";

import { useState } from "react";
import GroupModal from "./GroupModal";

export default function GroupList({ groups }: { groups: any[] }) {
    const [selectedGroup, setSelectedGroup] = useState<any | null>(null);

    return (
        <>
            <div className="flex space-x-4 overflow-x-auto pb-4">
                {groups.length > 0 ? (
                    groups.map((group) => (
                        <div
                            key={group.groupId}
                            className="min-w-[100px] h-[100px] bg-blue-500 rounded-xl flex items-center justify-center text-white font-semibold transition duration-200 hover:bg-blue-600 hover:scale-105 cursor-pointer"
                            onClick={() => setSelectedGroup(group)}
                        >
                            {group.name}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-700">No groups yet.</p>
                )}
            </div>

            {selectedGroup && (
                <GroupModal group={selectedGroup} onClose={() => setSelectedGroup(null)} />
            )}
        </>
    );
}
