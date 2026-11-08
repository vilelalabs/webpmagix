import Link from "next/link";

const Footer = () => {
    return (
        <footer className="border-t border-titlered w-full bg-redviolet">
            <div className="flex flex-row flex-wrap items-center justify-center p-5 gap-x-5 gap-y-2">
                <a
                    className="text-babypowder hover:text-richblack hover:font-bold"
                    href="https://hvilela.com" target="_blank" rel="noopener noreferrer">
                    hvilela.com
                </a>
                <p className="text-babypowder">|</p>
                <a
                    className="text-babypowder hover:text-richblack hover:font-bold"
                    href="https://github.com/vilelalabs" target="_blank" rel="noopener noreferrer">
                    github.com/vilelalabs
                </a>
                <p className="text-babypowder">|</p>
                <Link
                    className="text-babypowder hover:text-richblack hover:font-bold"
                    href="/privacy">
                    Privacy Policy
                </Link>
            </div>
        </footer>
    );
}

export default Footer;
