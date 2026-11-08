import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
    return (
        <nav className="border-b border-titlered">
            <Link href="/">
                <Image
                    src="/logo.png"
                    alt="WEBP Magix"
                    width={260}
                    height={55}
                    priority
                />
            </Link>
        </nav>
    );
}

export default Navbar;
