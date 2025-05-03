"use client";

import { useState } from "react";
import GroupModal from "./GroupModal";
import { useRouter } from "next/navigation";

export default function GroupList({ groups }: { groups: any[] }) {
    const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
    const router = useRouter();

    return (
        <>
            <div className="flex space-x-4 pb-4">
                {groups.length > 0 ? (
                    groups.map((group) => (
                        <div
                            key={group.groupId}
                            className="relative h-50 w-50 bg-[#0f3857] rounded-xl p-4 text-white font-semibold transition duration-200 hover:bg-[#c0dedf] hover:scale-105 cursor-pointer"
                            onClick={() =>
                                router.push(`/groups/${group.groupId}`)
                            }
                        >
                            <div className="flex items-center justify-center h-full text-center">
                                {group.name}
                            </div>

                            {/* Trash bin icon (bottom-left) */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("Delete group:", group.groupId);
                                }}
                                className="absolute bottom-4 left-4 text-white hover:text-red-400 cursor-pointer"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-7 w-7"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-7 0h8"
                                    />
                                </svg>
                            </button>

                            {/* Plus icon (bottom-right) */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedGroup(group);
                                }}
                                className="absolute bottom-4 right-4 text-white hover:text-green-400 cursor-pointer"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-7 w-7"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-700">No groups yet.</p>
                )}
            </div>

            {selectedGroup && (
                <GroupModal
                    group={selectedGroup}
                    onClose={() => setSelectedGroup(null)}
                />
            )}
        </>
    );
}
