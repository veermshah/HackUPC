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
                        placeholder={`Member ${index + 1} email`}
                        className="w-full mb-2 p-2 border border-gray-300 rounded-md text-black"
                        required
                    />
                ))}

                {emails.length < 6 && (
                    <button
                        onClick={addEmailField}
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition mb-4"
                    >
                        Add Another Member
                    </button>
                )}

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <button
                    onClick={handleInvite}
                    className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition mb-2"
                >
                    Send Invitations
                </button>

                <button
                    onClick={onClose}
                    className="w-full bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500 transition"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
