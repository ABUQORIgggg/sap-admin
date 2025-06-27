import React, { useEffect, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { RiNotification3Line, RiLogoutBoxRLine } from 'react-icons/ri';
import { MdKeyboardArrowDown, MdSettings } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../images/avatar2.png';
import { useStateContext } from '../Contexts/ContextProvider';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/AuthSlice';

const NavButton = ({ title, customFunc, icon, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={customFunc}
      className="relative text-xl rounded-full p-3 text-base-content hover:bg-base-300"
    >
      {dotColor && (
        <span
          style={{ background: dotColor }}
          className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
        />
      )}
      {icon}
    </button>
  </TooltipComponent>
);

const Navbar = () => {
  const { activeMenu, setActiveMenu, handleClick, isClicked, setScreenSize, screenSize } = useStateContext();
  const username = useSelector((state) => state.auth.user?.username || "User");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [setScreenSize]);

  useEffect(() => {
    setActiveMenu(screenSize > 900);
  }, [screenSize, setActiveMenu]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <div className="flex justify-between w-full p-1 md:ml-6 md:mr-6 relative z-[1000]">
        <NavButton
          title="Menu"
          customFunc={handleActiveMenu}
          icon={<AiOutlineMenu />}
        />
        <div className="flex">
          {/* <NavButton title="Notification" dotColor="rgb(254, 201, 15)" icon={<RiNotification3Line />} /> */}

          <TooltipComponent content="Profile" position="BottomCenter">
            <div
              className="flex items-center gap-2 cursor-pointer p-1 hover:bg-base-300 rounded-lg"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <img className="rounded-full w-12" src={avatar} alt="user-profile" />
              <p>
                <span className="text-base-content text-14">Hi,</span>
                <span className="text-primary font-bold ml-1 text-14">{username}</span>
              </p>
              <MdKeyboardArrowDown className="text-base-content text-14" />
            </div>
          </TooltipComponent>

          {isProfileOpen && (
            <div className="absolute right-0 top-16 bg-base-200 shadow-lg rounded-lg w-48 p-3 z-[9999]">
              <p className="text-center text-base-content font-semibold">{username}</p>
              <div className="mt-2 border-t border-base-300"></div>
              {/* <Link to="/settings">
                <button className="w-full text-left px-4 py-2 hover:bg-base-300 rounded-lg flex items-center gap-2">
                  <MdSettings /> Settings
                </button>
              </Link> */}
              <label
                htmlFor="logout-modal"
                className="w-full text-left px-4 py-2 hover:bg-base-300 rounded-lg text-error flex items-center gap-2 cursor-pointer"
                onClick={() => setIsLogoutModalOpen(true)}
              >
                <RiLogoutBoxRLine /> Logout
              </label>
            </div>
          )}
        </div>
      </div>
      {/* DaisyUI Modalka */}
      <input
        type="checkbox"
        id="logout-modal"
        className="modal-toggle"
        checked={isLogoutModalOpen}
        readOnly
      />
      <div className="modal">
        <div className="modal-box text-center">
          <h3 className="font-bold text-lg mb-4">Вы действительно хотите выйти?</h3>
          <div className="modal-action justify-center">
            <button onClick={handleLogout} className="btn btn-error text-white">
              Да, выйти
            </button>
            <label
              htmlFor="logout-modal"
              className="btn"
              onClick={() => setIsLogoutModalOpen(false)}
            >
              Отмена
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
