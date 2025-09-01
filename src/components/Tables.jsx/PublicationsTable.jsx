import { useEffect, useState } from "react";
// import * as Checkbox from "@radix-ui/react-checkbox";
// import { Dialog } from "radix-ui";
// import { Tooltip } from "radix-ui";
// import { Select } from "radix-ui";
// import { Button, Flex } from "@radix-ui/themes";
// import { TextField } from "@radix-ui/themes";
// import {Flex} from "@radix-ui/themes";
import { getAllPatents } from "../../API/index"; // <- your API function
import { LuPencil } from "react-icons/lu";
import { IoTrashOutline } from "react-icons/io5";
import DeleteModal from "../Modals/DeleteModal";

export default function PatentsTable() {
  const [patents, setPatents] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [metadata, setMetadata] = useState({
    total: 0,
    totalPages: 1,
    page: 1,
  });
  const [selectedPatentId, setSelectedPatentId] = useState(null);

  useEffect(() => {
    fetchPatents();
  }, [page, limit, search]);

  const fetchPatents = async () => {
    setLoading(true);
    try {
      const res = await getAllPatents(search, page, limit);
      const { allPatents, metaData } = res.data;
      setPatents(allPatents || []);
      setTotalPages(metaData.totalPages);
      setPage(metaData.page);
      setMetadata(metaData);
    } catch (err) {
      console.error("Error fetching patents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === patents.length ? [] : patents.map((p) => p.id)
    );
  };

  const handleDelete = () => {
    console.log("Deleting:", selectedRows);
    setDeleteModalOpen(false);
    setSelectedRows([]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    return d.toLocaleDateString();
  };

  return (
    <>
      <div>
        <div className="flex flex-col overflow-hidden h-full">
          {/* <main className="container min-w-full mx-auto flex-grow px-6 py-8"> */}
          <main className="w-full flex-grow px-8 py-1">
            <div className="bg-white shadow-lg rounded-lg p-8">
              {/* Header */}
              <div className="flex sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-700">
                  Patents Management
                </h2>

                <div className="flex gap-2 items-center">
                  {selectedRows.length > 0 && (
                    <button
                      className="px-4 py-2 rounded-lg bg-red-500 text-white shadow hover:bg-red-600"
                      onClick={() => setDeleteModalOpen(true)}
                    >
                      Delete All
                    </button>
                  )}

                  <div className="relative">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                      placeholder="Search patents..."
                      className="pl-3 pr-3 py-2 border rounded-lg focus:outline-none focus:ring w-64"
                    />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    Loading...
                  </div>
                ) : patents.length > 0 ? (
                  <table className="w-full border-collapse min-w-[1000px]  text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="px-4 py-2">
                          <input
                            type="checkbox"
                            checked={selectedRows.length === patents.length}
                            onChange={handleSelectAll}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                          />
                        </th>
                        <th className="text-left px-4 py-2">Patent #</th>
                        <th className="text-left px-4 py-2">Title</th>
                        <th className="text-left px-4 py-2">Abstract</th>
                        <th className="text-left px-4 py-2">Filing Date</th>
                        <th className="text-left px-4 py-2">Grant Date</th>
                        <th className="text-left px-4 py-2">Assignee</th>
                        <th className="text-left px-4 py-2">Country</th>
                        <th className="text-left px-4 py-2">School</th>
                        <th className="text-center px-4 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patents.map((p) => (
                        <tr key={p.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(p.id)}
                              onChange={() => handleRowSelect(p.id)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-2">{p.patent_number}</td>
                          <td className="px-4 py-2">{p.title}</td>
                          <td
                            className="px-4 py-2 max-w-xs truncate"
                            title={p.abstract}
                          >
                            {p.abstract}
                          </td>
                          <td className="px-4 py-2">
                            {formatDate(p.filing_date)}
                          </td>
                          <td className="px-4 py-2">
                            {formatDate(p.grant_date)}
                          </td>
                          <td className="px-4 py-2">{p.assignee}</td>
                          <td className="px-4 py-2">{p.country}</td>
                          <td className="px-4 py-2">{p.school?.name}</td>
                          <td className="px-4 py-2 text-center">
                            <div className="flex justify-center gap-2">
                              <button className="text-gray-500 hover:text-blue-600">
                                <LuPencil />
                              </button>

                              <button
                                className="text-gray-500 hover:text-red-600"
                                onClick={() => {
                                  setSelectedPatentId(p.id);
                                  setDeleteModalOpen(true);
                                }}
                              >
                                <IoTrashOutline />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-20 text-gray-500">
                    No patents found
                  </div>
                )}
              </div>

              {/* Pagination */}
              {patents.length > 0 && (
                <div className="flex justify-end items-center gap-4 mt-5">
                  <div className="flex items-center gap-2">
                    <h2 className="text-md font-normal text-gray-700 rounded-full">
                      {metadata.total} Records
                    </h2>
                    <span className="text-sm text-gray-600 px-2">Rows:</span>
                    <select
                      value={limit}
                      onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                      }}
                      className="px-3 py-1 border rounded-full w-20 focus:outline-none focus:ring-2 focus:ring-blueGray-600 focus:border-blueGray-600 cursor-pointer"
                    >
                      {[5, 10, 15, 20].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="px-2">
                      <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-4 py-1 border rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Prev
                      </button>
                    </div>

                    <span>
                      {page} / {totalPages}
                    </span>

                    <div className="px-2">
                      <button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-3 py-1 border rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <DeleteModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onDelete={() => deletePatent(selectedPatentId)}
              />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
