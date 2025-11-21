"use client";

import React from "react";

type DataItem = {
  id: number;
  name: string;
  email: string;
  status: string;
};

type CardTableProps = {
  title: string;
  data: DataItem[];
};

const CardTable: React.FC<CardTableProps> = ({ title, data }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">ID</th>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{item.id}</td>
                <td className="py-2 px-4 border-b">{item.name}</td>
                <td className="py-2 px-4 border-b">{item.email}</td>
                <td className="py-2 px-4 border-b">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CardTable;
