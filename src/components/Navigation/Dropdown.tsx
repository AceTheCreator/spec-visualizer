import { useState } from "react";

function Dropdown() {
    const [show, setShow] = useState<boolean>(false);
    const [active, setActive] = useState<string>("2.5.0")
  return (
    <div className="absolute z-10">
      <button
        id="dropdownHoverButton"
        data-dropdown-toggle="dropdownHover"
        data-dropdown-trigger="hover"
        className="text-black bg-white border border-gray-200 focus:border-black font-medium rounded-lg text-xs p-2 px-6 text-center inline-flex items-center"
        type="button"
        onClick={() => (show ? setShow(false) : setShow(true))}
      >
        {active}
        <svg
          className={`w-4 h-4 ml-2 ${show ? "rotate-180" : "rotate-0"}`}
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      <div
        id="dropdownHover"
        className={`z-10 ${
          show ? "block" : "hidden"
        } bg-white divide-y divide-gray-100 rounded-lg shadow-2xl w-44`}
      >
        <ul
          className="py-2 text-sm text-gray-700"
          aria-labelledby="dropdownHoverButton"
        >
          <li>
            <a
              href="#"
              onClick={() => {
                setActive("2.6.0");
                setShow(false)
              }}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-100"
            >
              2.6.0
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Dropdown;
