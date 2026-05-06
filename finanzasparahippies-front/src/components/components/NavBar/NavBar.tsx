'use client';

import React from "react";
import Link from "next/link";
import Dropdown from "./Dropdown";
import { comprarDropdown, masDropdown } from "./menuData";


const NavBar: React.FC = () => {
    return (
        <nav className="border-b shadow">
            <div className="max-w-7xl mx-auto px-4 flex items-center h-16">
                <div className="flex space-x-4">
                    <Link
                        href="/"
                        className="px-4 py-2 text-white hover:text-green-600"
                    >
                        Inicio
                    </Link>
                    <Link
                        href="/Blog"
                        className="px-4 py-2 text-white hover:text-green-600"
                    >
                        Blog
                    </Link>
                    <Dropdown label="Comprar" items={comprarDropdown} />
                    <Dropdown label="Más" items={masDropdown} />
                </div>
            </div>
        </nav>
    );
};

export default NavBar;