"use client";

import { useState } from "react";

export default function CreateGroupButton({ action }: { action: (formData: FormData) => void }) {
  const [show, setShow] = useState(false);

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="px-4 py-2 rounded-xl border border-[#0f3857] bg-[#0f3857] text-white font-semibold hover:bg-white hover:text-[#0f3857] transition duration-200 cursor-pointer"
      >
        Create Group
      </button>

      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pt-[100px]">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
            <form action={action} className="space-y-4">
              <h2 className="text-xl font-semibold text-[#000000]">Crear nuevo grupo</h2>
              <input
                type="text"
                name="groupName"
                placeholder="Nombre del grupo"
                required
                className="w-full px-4 py-2 rounded-md border border-gray-300 text-[#000000]"
              />
              <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={() => setShow(false)}
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 text-[#000000] cursor-pointer"
                    >
                    Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0f3857] text-white rounded-md hover:bg-[#0d2f49] cursor-pointer"
                >
                  Crear grupo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
