import Image from "next/image";

const Navbar = () => {
    return (
        <nav className="border-b-2 border-titlered">
            <Image
                src="/logo.png"
                alt="Logo"
                width={260}
                height={55}
            />
        </nav>
    );
}

export default Navbar;