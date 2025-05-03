"use client";

import { useState } from "react";

export default function GroupModal({ group, onClose }: { group: any; onClose: () => void }) {
    const [emails, setEmails] = useState<string[]>([""]);
    const [error, setError] = useState("");

    const addEmailField = () => {
        if (emails.length < 6) {
            setEmails([...emails, ""]);
        }
    };

    const updateEmail = (index: number, value: string) => {
        const updated = [...emails];
        updated[index] = value;
        setEmails(updated);
    };

    const handleInvite = async () => {
        setError("");

        const validEmails = emails.filter(email => email.trim() !== "");
        const invalid = validEmails.find(email => !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email));

        if (invalid) {
            setError("Please enter only valid emails.");
            return;
        }

        try {
            const res = await fetch("/api/send-invitations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    emails: validEmails,
                    groupName: group.name,
                    groupId: group.groupId,
                }),
            });
        
            if (!res.ok) {
                const text = await res.text(); // en vez de res.json(), para depurar
                console.error("Respuesta del servidor (error):", text);
                throw new Error("No se pudo enviar la invitación.");
            }
        
            const result = await res.json(); // solo si res.ok es true
            alert("Invitations sent!");
            onClose();
        } catch (err) {
            console.error("Error enviando invitaciones:", err);
            setError("Error enviando el correo. Revisa la consola.");
        }
        
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-center text-black">{group.name}</h2>

                {emails.map((email, index) => (
                    <input
                        key={index}
                        type="email"
                        value={email}
                        onChange={(e) => updateEmail(index, e.target.value)}
                        placeholder={`johndoe@gmail.com`}
                        className="w-full mb-2 p-2 border border-gray-300 rounded-md text-black"
                        required
                    />
                ))}

                {emails.length < 6 && (
                    <button
                        onClick={addEmailField}
                        className="w-full bg-[#0f3857] text-white py-2 rounded-md hover:bg-[#c0dedf] transition mb-2 mt-4 cursor-pointer"
                    >
                        Add Another Member
                    </button>
                )}

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <button
                    onClick={handleInvite}
                    className="w-full bg-[#83d6d8] text-white py-2 rounded-md hover:bg-[#0f3857] transition mb-2 cursor-pointer"
                >
                    Send Invitations
                </button>

                <button
                    onClick={onClose}
                    className="w-full bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500 transition cursor-pointer"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
