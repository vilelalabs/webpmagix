const Footer = () => {
    return (
        <footer className="border-t border-titlered relative bottom-0 w-full z-20 bg-redviolet">
            <div className="flex flex-row items-center justify-center p-5 gap-5">
                <a
                 className="text-babypowder hover:text-richblack hover:font-bold"
                 href="hvilela.com">
                    hvilela.com
                </a>
                <p className="text-babypowder">|</p>
                <a
                 className="text-babypowder hover:text-richblack hover:font-bold"
                 href="github.com/vilelalabs">
                    github.com/vilelalabs

                </a>

            </div>
        </footer>
    );
}

export default Footer;