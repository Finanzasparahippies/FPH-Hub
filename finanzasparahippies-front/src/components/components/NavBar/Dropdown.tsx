'use client';

import React, { useState } from "react";
import Link from "next/link";

interface DropdownProps {
    label: string;
    items: { label: string; href: string }[];
}

const Dropdown: React.FC<DropdownProps> = ({ label, items }) => {
    const [open, setOpen] = useState(false);

    const handleMouseEnter = () => setOpen(true);
    const handleMouseLeave = () => setOpen(false);

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                className="px-4 py-2 text-white hover:text-green-600 focus:outline-none"
                type="button"
            >
                {label}
            </button>
            {open && (
                <div className="absolute left-0 w-40 rounded shadow-lg z-10">
                    {items.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="block mt-2 px-4 py-2 hover:text-green-600"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
