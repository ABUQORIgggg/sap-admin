import React from "react";
import { MdOutlineCancel } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useStateContext } from "../Contexts/ContextProvider";

const ThemeSettings = () => {
  const { setThemeSettings, currentMode, setMode } = useStateContext();

  const handleThemeChange = (theme) => {
    setMode(theme); 
  };

  return (
    <div className="bg-half-transparent w-screen fixed nav-item top-0 right-0">
      <div className="float-right h-screen bg-base-100 max-w-[30%] w-full">
        <div className="flex justify-between items-center p-4 ml-4">
          <p className="font-semibold text-xl">Settings</p>
          <button
            type="button"
            onClick={() => setThemeSettings(false)}
            className="text-2xl p-3 hover:drop-shadow-xl hover:bg-base-300 rounded-full"
          >
            <MdOutlineCancel />
          </button>
        </div>

        <div className="flex-col border-t-1 border-base-200 p-4 ml-4">
          <p className="font-semibold text-lg">Theme Options</p>

          <div className="mt-4 form-control">
            <label className="label cursor-pointer flex items-center gap-2">
              <input
                type="radio"
                name="theme"
                value="Light"
                className="radio radio-primary"
                onChange={() => handleThemeChange("Light")}
                checked={currentMode === "Light"}
              />
              <span className="label-text">Light</span>
            </label>
          </div>

          <div className="mt-2 form-control">
            <label className="label cursor-pointer flex items-center gap-2">
              <input
                type="radio"
                name="theme"
                value="Dark"
                className="radio radio-primary"
                onChange={() => handleThemeChange("Dark")}
                checked={currentMode === "Dark"}
              />
              <span className="label-text">Dark</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;