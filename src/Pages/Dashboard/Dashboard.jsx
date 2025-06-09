// import React, { useState, useEffect, useMemo } from "react";
// import { useSelector } from "react-redux";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import ChartComponent from "../../Components/ChartComponent/ChartComponent";

// //abubakir tentak

// const Loader = () => (
//   <div className="flex items-center justify-center h-80">
//     <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-opacity-70"></div>
//   </div>
// );

// const Dashboard = () => {
//   const user = useSelector((state) => state?.auth?.user?.username || "Гость");
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [usersData, setUsersData] = useState([]);
//   const [loadingUsers, setLoadingUsers] = useState(true);
//   const [errorUsers, setErrorUsers] = useState(null);
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [categoriesData, setCategoriesData] = useState([]);
//   const [loadingCategories, setLoadingCategories] = useState(true);
//   const [errorCategories, setErrorCategories] = useState(null);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
//     setIsDarkMode(darkModeMediaQuery.matches);
//     const listener = (e) => setIsDarkMode(e.matches);
//     darkModeMediaQuery.addEventListener("change", listener);
//     return () => darkModeMediaQuery.removeEventListener("change", listener);
//   }, []);

//   const fetchUsersData = () => {
//     setLoadingUsers(true);
//     fetch("https://zaporka-backend.onrender.com/api/v1/users", {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((res) => {
//         if (res.status === 403) throw new Error("Доступ запрещён. Проверьте токен.");
//         if (!res.ok) throw new Error("Ошибка при получении пользователей");
//         return res.json();
//       })
//       .then((data) => {
//         setTotalUsers(data.length);
//         const weekData = Array(7).fill(0);
//         const today = new Date();
//         const todayDay = today.getDay();

//         data.forEach((user) => {
//           const createdDate = new Date(user.createdAt);
//           if (isNaN(createdDate)) return;
//           const daysDiff = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));
//           if (daysDiff >= 0 && daysDiff < 7) {
//             const index = (6 - daysDiff + todayDay) % 7;
//             weekData[index]++;
//           }
//         });

//         setUsersData(weekData);
//         setErrorUsers(null);
//       })
//       .catch((err) => setErrorUsers(err.message))
//       .finally(() => setLoadingUsers(false));
//   };

//   const fetchCategoriesData = () => {
//     setLoadingCategories(true);
//     fetch("https://zaporka-backend.onrender.com/api/v1/categories")
//       .then((res) => {
//         if (!res.ok) throw new Error("Ошибка при получении категорий");
//         return res.json();
//       })
//       .then((data) => {
//         setCategoriesData(data);
//         setErrorCategories(null);
//       })
//       .catch((err) => setErrorCategories(err.message))
//       .finally(() => setLoadingCategories(false));
//   };

//   useEffect(() => {
//     if (!token) {
//       setErrorUsers("Отсутствует токен авторизации.");
//       setErrorCategories("Отсутствует токен авторизации.");
//       setLoadingUsers(false);
//       setLoadingCategories(false);
//       return;
//     }

//     fetchUsersData();
//     fetchCategoriesData();
//   }, [token]);

//   const getWeekLabels = () => {
//     const today = new Date();
//     const todayDay = today.getDay();
//     const days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
//     const labels = [];
//     for (let i = 6; i >= 0; i--) {
//       const dayIndex = (todayDay - i + 7) % 7;
//       labels.push(days[dayIndex]);
//     }
//     return labels;
//   };

//   const usersChartData = useMemo(
//     () => ({
//       labels: getWeekLabels(),
//       datasets: [
//         {
//           label: "Новые пользователи",
//           data: usersData,
//           fill: true,
//           backgroundColor: isDarkMode ? "rgba(96, 165, 250, 0.3)" : "rgba(59, 130, 246, 0.2)",
//           borderColor: isDarkMode ? "rgba(96, 165, 250, 0.8)" : "rgba(59, 130, 246, 1)",
//           tension: 0.4,
//           pointRadius: 5,
//           pointHoverRadius: 8,
//         },
//       ],
//     }),
//     [usersData, isDarkMode]
//   );

//   const categoriesChartData = useMemo(
//     () => ({
//       labels: categoriesData.map((category) => category.name),
//       datasets: [
//         {
//           label: "Продажа по категориям",
//           data: categoriesData.map((category) => category.sales || 0),
//           backgroundColor: categoriesData.map((_, index) =>
//             isDarkMode
//               ? `rgba(${100 + index * 40}, ${150 + index * 20}, 255, 0.7)`
//               : `rgba(${80 + index * 40}, ${120 + index * 20}, 200, 0.6)`
//           ),
//           borderColor: categoriesData.map((_, index) =>
//             isDarkMode
//               ? `rgba(${100 + index * 40}, ${150 + index * 20}, 255, 1)`
//               : `rgba(${80 + index * 40}, ${120 + index * 20}, 200, 1)`
//           ),
//           borderWidth: 1,
//         },
//       ],
//     }),
//     [categoriesData, isDarkMode]
//   );

//   const chartOptions = useMemo(
//     () => ({
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: {
//           position: "top",
//           labels: {
//             color: isDarkMode ? "#d1d5db" : "#374151",
//             font: { size: 14 },
//           },
//         },
//         title: {
//           display: true,
//           color: isDarkMode ? "#d1d5db" : "#374151",
//           font: { size: 16, weight: "bold" },
//         },
//       },
//       scales: {
//         x: {
//           ticks: {
//             color: isDarkMode ? "#d1d5db" : "#374151",
//             font: { size: 12 },
//           },
//           grid: { display: false },
//         },
//         y: {
//           ticks: {
//             color: isDarkMode ? "#d1d5db" : "#374151",
//             font: { size: 12 },
//           },
//           beginAtZero: true,
//           grid: {
//             color: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
//           },
//         },
//       },
//     }),
//     [isDarkMode]
//   );

//   return (
//     <div className="min-h-screen bg-background-light dark:bg-background-dark p-6 transition-colors duration-300">
//       <motion.div
//         className="max-w-6xl mx-auto space-y-8"
//         initial="hidden"
//         animate="visible"
//         variants={{
//           hidden: { opacity: 0, y: 20 },
//           visible: {
//             opacity: 1,
//             y: 0,
//             transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.2 },
//           },
//         }}
//       >
//         <motion.div
//           variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
//           className="text-center"
//         >
//           <h1 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">
//             Добро пожаловать, <span className="text-primary">{user}</span>
//           </h1>
//           <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">
//             Всего пользователей: <strong>{totalUsers}</strong>
//           </p>
//           <button
//             className="mt-4 px-4 py-2 bg-primary dark:bg-primary-dark text-white rounded-lg shadow-md hover:bg-primary/80 dark:hover:bg-primary-dark/80 transition-colors"
//             onClick={fetchUsersData}
//           >
//             Обновить данные
//           </button>
//           <div className="mt-4">
//             <Link
//               to="/users"
//               className="text-primary dark:text-primary-dark hover:underline"
//             >
//               Перейти к списку пользователей
//             </Link>
//           </div>
//         </motion.div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <motion.div
//             className="bg-card-light dark:bg-card-dark rounded-xl shadow-md p-6 h-96 transition-colors duration-300"
//             variants={{ hidden: {}, visible: {} }}
//           >
//             <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
//               Пользователи за неделю
//             </h2>
//             {loadingUsers ? (
//               <Loader />
//             ) : errorUsers ? (
//               <p className="text-error">{errorUsers}</p>
//             ) : (
//               <div className="relative h-80">
//                 <ChartComponent
//                   type="line"
//                   data={usersChartData}
//                   options={{
//                     ...chartOptions,
//                     plugins: {
//                       ...chartOptions.plugins,
//                       title: {
//                         text: "Новые пользователи за неделю",
//                         display: true,
//                       },
//                     },
//                   }}
//                 />
//               </div>
//             )}
//           </motion.div>

//           <motion.div
//             className="bg-card-light dark:bg-card-dark rounded-xl shadow-md p-6 h-96 transition-colors duration-300"
//             variants={{ hidden: {}, visible: {} }}
//           >
//             <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
//               Продажа по категориям
//             </h2>
//             {loadingCategories ? (
//               <Loader />
//             ) : errorCategories ? (
//               <p className="text-error">{errorCategories}</p>
//             ) : (
//               <div className="relative h-80">
//                 <ChartComponent
//                   type="bar"
//                   data={categoriesChartData}
//                   options={{
//                     ...chartOptions,
//                     plugins: {
//                       ...chartOptions.plugins,
//                       title: {
//                         text: "Продажа по категориям",
//                         display: true,
//                       },
//                     },

//                   }}
//                 />
//               </div>
//             )}
//           </motion.div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Dashboard;


import React from 'react'

const Dashboard = () => {
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard