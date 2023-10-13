import Image from "next/image";

const Navbar = () => {
    return (
        <nav className="border-b border-titlered">
            <a href="/">
                <Image
                    src="/logo.png"
                    alt="Logo"
                    width={260}
                    height={55}
                />
            </a>
        </nav>
    );
}

export default Navbar;