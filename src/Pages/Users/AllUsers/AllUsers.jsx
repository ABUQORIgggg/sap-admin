import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiRefreshCcw, FiUserPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import CustomPagination from "../../../Components/CustomPagination/CustomPagination";
import CustomTable from "../../../Components/CustomTable/CustomTable";
import Loading from "../../../Components/Loading/Loading";
import { useSelector } from "react-redux";

const AllUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortedBy, setSortedBy] = useState(null);
  const [data, setData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [grades, setGrades] = useState([]);
  const [facultiesLoading, setFacultiesLoading] = useState(false);
  const [gradesLoading, setGradesLoading] = useState(false);
  const [facultiesError, setFacultiesError] = useState(null);
  const [gradesError, setGradesError] = useState(null);
  const token = useSelector((state) => state.auth.user.token);

  const authHeaders = token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : { "Content-Type": "application/json" };

  const [modalState, setModalState] = useState({
    isAddOpen: false,
    isEditOpen: false,
    editUserId: null,
    newName: "",
    newSurname: "",
    newUniversityId: "",
    newEmail: "",
    newPassword: "",
    newFaculty: "",
    newGrade: "",
    isActionLoading: false,
  });

  const apiRequest = async (url, options) => {
    try {
      console.log("Request URL:", url, "Token:", token);
      const response = await fetch(url, {
        ...options,
        headers: authHeaders,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Xatolik: ${response.status} - ${errorText || "Noma'lum xatolik"}`);
      }
      return response.status === 204 ? {} : await response.json();
    } catch (err) {
      console.error(`API so'rov xatosi (${url}):`, err);
      throw err;
    }
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = "http://37.140.216.178/api/v1/admin/userlist/";
      const result = await apiRequest(endpoint, { method: "GET" });
      console.log("API Response:", result);
      const dataArray = Array.isArray(result.results) ? result.results : [];
      console.log("Fetched Users:", dataArray);
      setData(dataArray);
    } catch (err) {
      setError(
        err.message.includes("404")
          ? "Foydalanuvchilar ro'yxati topilmadi. Iltimos, API manzilini tekshiring."
          : err.message.includes("401")
          ? "Avtorizatsiya xatosi. Tokenni tekshiring."
          : `Ma'lumotlarni yuklashda xatolik: ${err.message}`
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFacultiesAndGrades = useCallback(async () => {
    setFacultiesLoading(true);
    setGradesLoading(true);
    setFacultiesError(null);
    setGradesError(null);

    try {
      // Fetch faculties
      const facultiesResult = await apiRequest("http://37.140.216.178/api/v1/admin/faculties/", {
        method: "GET",
      });
      const facultiesArray = Array.isArray(facultiesResult.results)
        ? facultiesResult.results
        : Array.isArray(facultiesResult)
        ? facultiesResult
        : [];
      console.log("Fetched Faculties:", facultiesArray);
      setFaculties(facultiesArray);
    } catch (err) {
      setFacultiesError(`Fakultetlarni yuklashda xatolik: ${err.message}`);
      toast.error(`Fakultetlarni yuklashda xatolik: ${err.message}`);
    } finally {
      setFacultiesLoading(false);
    }

    try {
      // Fetch grades
      const gradesResult = await apiRequest("http://37.140.216.178/api/v1/admin/grades/", {
        method: "GET",
      });
      const gradesArray = Array.isArray(gradesResult.results)
        ? gradesResult.results
        : Array.isArray(gradesResult)
        ? gradesResult
        : [];
      console.log("Fetched Grades:", gradesArray);
      setGrades(gradesArray);
    } catch (err) {
      setGradesError(`Kurslarni yuklashda xatolik: ${err.message}`);
      toast.error(`Kurslarni yuklashda xatolik: ${err.message}`);
    } finally {
      setGradesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchUsers().finally(() => setTimeout(() => setIsRefreshing(false), 1000));
  }, [fetchUsers]);

  const openAddModal = () => {
    setModalState((prev) => ({
      ...prev,
      isAddOpen: true,
      newName: "",
      newSurname: "",
      newUniversityId: "",
      newEmail: "",
      newPassword: "",
      newFaculty: "",
      newGrade: "",
    }));
    fetchFacultiesAndGrades();
  };

  const openEditModal = (user) => {
    setModalState((prev) => ({
      ...prev,
      isEditOpen: true,
      editUserId: user.id,
      newName: user.name || "",
      newSurname: user.surname || "",
      newUniversityId: user.university_id || "",
      newEmail: "",
      newPassword: "",
      newFaculty: "",
      newGrade: "",
    }));
  };

  const closeModal = () => {
    setModalState({
      isAddOpen: false,
      isEditOpen: false,
      editUserId: null,
      newName: "",
      newSurname: "",
      newUniversityId: "",
      newEmail: "",
      newPassword: "",
      newFaculty: "",
      newGrade: "",
      isActionLoading: false,
    });
    setFaculties([]);
    setGrades([]);
    setFacultiesError(null);
    setGradesError(null);
  };

  const handleAddUser = async () => {
    const { newName, newSurname, newUniversityId, newEmail, newPassword, newFaculty, newGrade } = modalState;

    if (!newName || !newSurname || !newUniversityId || !newEmail || !newPassword || !newFaculty || !newGrade) {
      toast.error("Barcha maydonlar to‘ldirilishi shart!");
      return;
    }

    setModalState((prev) => ({ ...prev, isActionLoading: true }));

    try {
      await apiRequest("http://37.140.216.178/api/v1/admin/users/", {
        method: "POST",
        body: JSON.stringify({
          name: newName,
          surname: newSurname,
          university_id: newUniversityId,
          email: newEmail,
          password: newPassword,
          faculty: Number(newFaculty),
          grade: Number(newGrade),
        }),
      });
      toast.success("Foydalanuvchi muvaffaqiyatli qo‘shildi!");
      await fetchUsers();
      closeModal();
    } catch (err) {
      console.error("Add user error:", err);
      toast.error(`Qo‘shishda xatolik: ${err.message}`);
    } finally {
      setModalState((prev) => ({ ...prev, isActionLoading: false }));
    }
  };

  const handleEditUser = async () => {
    const { editUserId, newName, newSurname, newUniversityId, newEmail, newPassword, newFaculty } = modalState;

    if (!newName || !newSurname || !newUniversityId || !newEmail || !newFaculty) {
      toast.error("Barcha majburiy maydonlar to‘ldirilishi shart!");
      return;
    }

    setModalState((prev) => ({ ...prev, isActionLoading: true }));

    try {
      const payload = {
        name: newName,
        surname: newSurname,
        university_id: newUniversityId,
        email: newEmail,
        faculty: Number(newFaculty),
      };
      if (newPassword) payload.password = newPassword;

      await apiRequest(`http://37.140.216.178/api/v1/admin/users/${editUserId}/`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      toast.success("Foydalanuvchi muvaffaqiyatli tahrirlandi!");
      await fetchUsers();
      closeModal();
    } catch (err) {
      console.error("Edit user error:", err);
      toast.error(`Tahrirlashda xatolik: ${err.message}`);
    } finally {
      setModalState((prev) => ({ ...prev, isActionLoading: false }));
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Foydalanuvchini o‘chirishni tasdiqlaysizmi?")) return;

    setLoading(true);
    try {
      await apiRequest(`http://37.140.216.178/api/v1/admin/users/${id}/`, { method: "DELETE" });
      toast.success("Foydalanuvchi muvaffaqiyatli o‘chirildi!");
      await fetchUsers();
    } catch (err) {
      console.error("Delete user error:", err);
      toast.error(`O‘chirishda xatolik: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...data];
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter((user) =>
        [user.id, user.university_id, user.name, user.surname]
          .filter(Boolean)
          .some((field) => field.toString().toLowerCase().includes(lowerSearchTerm))
      );
    }
    if (sortedBy) {
      result.sort((a, b) => {
        const aValue = a[sortedBy]?.toString() || "";
        const bValue = b[sortedBy]?.toString() || "";
        return aValue > bValue ? 1 : -1;
      });
    }
    return result;
  }, [data, searchTerm, sortedBy]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    return filteredAndSortedUsers.slice(startIndex, endIndex);
  }, [filteredAndSortedUsers, currentPage, usersPerPage]);

  const columns = useMemo(
    () => [
      {
        key: "number",
        label: "№",
        sortable: false,
        render: (_, __, index) => (currentPage - 1) * usersPerPage + index + 1,
      },
      {
        key: "image",
        label: "Profil",
        sortable: false,
        render: (value) => (
          <div className="avatar">
            <div className="w-10 h-10 rounded-full">
              {value ? (
                <img
                  src={`http://37.140.216.178${value}`}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <img
                  src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                  alt="Default Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              )}
            </div>
          </div>
        ),
      },
      {
        key: "name",
        label: "Ism",
        sortable: true,
        render: (value) => value || "-",
      },
      {
        key: "surname",
        label: "Familiya",
        sortable: true,
        render: (value) => value || "-",
      },
      {
        key: "id",
        label: "ID",
        sortable: true,
        render: (value) => value || "-",
      },
      {
        key: "university_id",
        label: "Universitet ID",
        sortable: true,
        render: (value) => value || "-",
      },
      {
        key: "inactive_tokens",
        label: "Faol bo‘lmagan tokenlar",
        sortable: false,
        render: (value) => (value !== null && value !== undefined ? value.toString() : "-"),
      },
    ],
    [currentPage, usersPerPage]
  );

  const actions = useMemo(
    () => [
      {
        label: "Tahrirlash",
        icon: <FiEdit className="w-4 h-4" />,
        onClick: (row) => openEditModal(row),
        className: "btn btn-ghost btn-sm text-primary",
      },
      {
        label: "O‘chirish",
        icon: <FiTrash2 className="w-4 h-4" />,
        onClick: (row) => handleDeleteUser(row.id),
        className: "btn btn-ghost btn-sm text-error",
      },
    ],
    []
  );

  if (loading) return <Loading />;
  if (error) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen bg-base-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-error text-lg mb-6 font-medium">{error}</p>
        <motion.button
          className="btn btn-primary"
          onClick={fetchUsers}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Qayta urinish
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="p-6 bg-base-100 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <motion.h1
            className="text-3xl font-bold text-base-content"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Foydalanuvchilar
          </motion.h1>
          <div className="flex gap-3">
            <motion.button
              className="btn btn-primary btn-sm flex items-center gap-2"
              onClick={openAddModal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiUserPlus className="w-4 h-4" /> Qo‘shish
            </motion.button>
            <motion.button
              className="btn btn-outline btn-sm flex items-center gap-2"
              onClick={handleRefresh}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiRefreshCcw className={isRefreshing ? "animate-spin w-4 h-4" : "w-4 h-4"} /> Yangilash
            </motion.button>
          </div>
        </div>

        <motion.div
          className="mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="input-group w-full max-w-md">
            <input
              type="text"
              placeholder="Ism, familiya, ID bo‘yicha qidirish..."
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="btn btn-square btn-primary">
              <FiSearch className="w-5 h-5" />
            </span>
          </div>
        </motion.div>

        <motion.div
          className="card bg-base-200 shadow-xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="card-body p-0">
            <CustomTable
              data={paginatedUsers}
              columns={columns}
              actions={actions}
              emptyMessage="Foydalanuvchilar topilmadi"
              onSort={setSortedBy}
              className="table table-zebra w-full"
            />
          </div>
        </motion.div>

        <motion.div
          className="mt-6 flex justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <CustomPagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredAndSortedUsers.length / usersPerPage)}
            onPageChange={setCurrentPage}
            className="btn-group"
          />
        </motion.div>
      </div>

      {(modalState.isAddOpen || modalState.isEditOpen) && (
        <motion.div
          className="modal modal-open"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="modal-box bg-base-200 shadow-xl max-w-lg">
            <motion.h3
              className="font-bold text-lg text-base-content mb-4"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
            >
              {modalState.isAddOpen ? "Yangi foydalanuvchi qo‘shish" : "Foydalanuvchini tahrirlash"}
            </motion.h3>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Ism</span>
                </label>
                <input
                  type="text"
                  placeholder="Ism kiriting"
                  className="input input-bordered w-full"
                  value={modalState.newName}
                  onChange={(e) => setModalState((prev) => ({ ...prev, newName: e.target.value }))}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Familiya</span>
                </label>
                <input
                  type="text"
                  placeholder="Familiya kiriting"
                  className="input input-bordered w-full"
                  value={modalState.newSurname}
                  onChange={(e) => setModalState((prev) => ({ ...prev, newSurname: e.target.value }))}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Universitet ID</span>
                </label>
                <input
                  type="text"
                  placeholder="Universitet ID kiriting"
                  className="input input-bordered w-full"
                  value={modalState.newUniversityId}
                  onChange={(e) => setModalState((prev) => ({ ...prev, newUniversityId: e.target.value }))}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="Email kiriting"
                  className="input input-bordered w-full"
                  value={modalState.newEmail}
                  onChange={(e) => setModalState((prev) => ({ ...prev, newEmail: e.target.value }))}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Parol {modalState.isEditOpen && "(ixtiyoriy)"}</span>
                </label>
                <input
                  type="password"
                  placeholder={modalState.isEditOpen ? "Yangi parol (ixtiyoriy)" : "Parol kiriting"}
                  className="input input-bordered w-full"
                  value={modalState.newPassword}
                  onChange={(e) => setModalState((prev) => ({ ...prev, newPassword: e.target.value }))}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Fakultet</span>
                </label>
                {modalState.isAddOpen ? (
                  <select
                    className="select select-bordered w-full"
                    value={modalState.newFaculty}
                    onChange={(e) => setModalState((prev) => ({ ...prev, newFaculty: e.target.value }))}
                    disabled={facultiesLoading || !!facultiesError}
                  >
                    <option value="">Fakultetni tanlang</option>
                    {faculties.map((faculty) => (
                      <option key={faculty.id} value={faculty.id}>
                        {faculty.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    placeholder="Fakultet raqami kiriting"
                    className="input input-bordered w-full"
                    value={modalState.newFaculty}
                    onChange={(e) => setModalState((prev) => ({ ...prev, newFaculty: e.target.value }))}
                  />
                )}
                {facultiesError && modalState.isAddOpen && (
                  <span className="text-error text-sm mt-1">{facultiesError}</span>
                )}
              </div>
              {modalState.isAddOpen && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Kurs</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={modalState.newGrade}
                    onChange={(e) => setModalState((prev) => ({ ...prev, newGrade: e.target.value }))}
                    disabled={gradesLoading || !!gradesError}
                  >
                    <option value="">Kursni tanlang</option>
                    {grades.map((grade) => (
                      <option key={grade.id} value={grade.id}>
                        {grade.name}
                      </option>
                    ))}
                  </select>
                  {gradesError && <span className="text-error text-sm mt-1">{gradesError}</span>}
                </div>
              )}
            </div>
            <div className="modal-action mt-6 flex justify-end gap-3">
              <motion.button
                className="btn btn-primary btn-sm"
                onClick={modalState.isAddOpen ? handleAddUser : handleEditUser}
                disabled={modalState.isActionLoading || facultiesLoading || gradesLoading || !!facultiesError || !!gradesError}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {modalState.isActionLoading ? "Yuklanmoqda..." : modalState.isAddOpen ? "Qo‘shish" : "Saqlash"}
              </motion.button>
              <motion.button
                className="btn btn-outline btn-sm"
                onClick={closeModal}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Bekor qilish
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AllUsers;