import Link from "next/link";

// Privacy policy (LGPD – Lei nº 13.709/2018), in Portuguese and English.
// Linked from the home page notice and from the download page. Keep it in step
// with app/api/convert, app/api/download and lib/storage.ts.

export const metadata = {
    title: "WEBP Magix | Privacidade / Privacy",
    description: "Política de privacidade do WEBP Magix (LGPD) / Privacy policy of WEBP Magix.",
};

const CONTACT = "hvilelaeng@gmail.com";

type Section = { title: string; paragraphs: string[] };
type Policy = { id: string; lang: string; label: string; title: string; updated: string; intro: string; sections: Section[] };

const POLICIES: Policy[] = [
    {
        id: "pt",
        lang: "pt-BR",
        label: "Português",
        title: "Política de Privacidade",
        updated: "Última atualização: 8 de novembro de 2026",
        intro: "Esta política explica como o WEBP Magix trata as imagens e os dados pessoais de quem o usa, de acordo com a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018).",
        sections: [
            {
                title: "Quem é o responsável",
                paragraphs: [`O WEBP Magix é mantido por Henrique Vilela (Vilela Labs), controlador dos dados tratados aqui. Para qualquer assunto sobre privacidade ou para exercer os seus direitos, escreva para ${CONTACT}.`],
            },
            {
                title: "Quais dados tratamos",
                paragraphs: [
                    "As imagens que você envia para converter e os nomes dos arquivos. Imagens podem conter pessoas ou outras informações pessoais; envie apenas imagens que você tem o direito de usar.",
                    "Não há cadastro, login, cookies nem ferramentas de análise. O provedor de hospedagem mantém registros técnicos de acesso (como endereço IP e navegador) para a segurança do servidor.",
                ],
            },
            {
                title: "Para que usamos e com qual base legal",
                paragraphs: [
                    "As imagens são usadas somente para gerar os arquivos WebP que você pediu (execução do serviço solicitado, art. 7º, V, da LGPD). Ninguém as abre, analisa ou usa para outro fim, e elas não são compartilhadas.",
                    "Os metadados das imagens, como o EXIF (que pode incluir a localização GPS), não são copiados para os arquivos WebP.",
                ],
            },
            {
                title: "Por quanto tempo guardamos",
                paragraphs: [
                    "Cada conversão fica numa pasta temporária com nome aleatório. A imagem original é apagada logo após a conversão e os arquivos WebP em até 5 minutos. Nesse intervalo, só quem tem o link de download consegue baixá-los.",
                ],
            },
            {
                title: "Cookies",
                paragraphs: ["O WEBP Magix não usa cookies nem armazenamento no navegador; os arquivos escolhidos ficam apenas na memória da página até a conversão."],
            },
            {
                title: "Com quem compartilhamos",
                paragraphs: ["Com ninguém além do provedor de hospedagem que executa o serviço, que pode ter servidores fora do Brasil (art. 33 da LGPD). Os dados também podem ser compartilhados se a lei ou uma ordem judicial exigir."],
            },
            {
                title: "Seus direitos",
                paragraphs: [
                    `A LGPD garante, entre outros, os direitos de confirmação, acesso, correção, eliminação e informação sobre o tratamento dos seus dados (art. 18). Como os arquivos são apagados em minutos, em geral não resta nenhum dado seu. Dúvidas e pedidos: ${CONTACT}. Você também pode procurar a Autoridade Nacional de Proteção de Dados (ANPD).`,
                ],
            },
            {
                title: "Alterações",
                paragraphs: ["Esta política pode ser atualizada. A data no topo indica sempre a versão em vigor."],
            },
        ],
    },
    {
        id: "en",
        lang: "en",
        label: "English",
        title: "Privacy Policy",
        updated: "Last updated: November 8, 2026",
        intro: "This policy explains how WEBP Magix handles the images and personal data of its users, in line with Brazil's General Data Protection Law (LGPD – Law No. 13,709/2018).",
        sections: [
            {
                title: "Who is responsible",
                paragraphs: [`WEBP Magix is run by Henrique Vilela (Vilela Labs), the controller of the data processed here. For any privacy matter or to exercise your rights, write to ${CONTACT}.`],
            },
            {
                title: "What data we process",
                paragraphs: [
                    "The images you upload for conversion and their file names. Images may show people or other personal information; only upload images you are allowed to use.",
                    "There is no account, sign-in, cookie or analytics tool. The hosting provider keeps technical access logs (such as IP address and browser) for the server's security.",
                ],
            },
            {
                title: "Why we use it and on which legal basis",
                paragraphs: [
                    "Images are only used to create the WebP files you asked for (performance of the requested service, LGPD art. 7, V). Nobody opens, analyses or uses them for anything else, and they are not shared.",
                    "Image metadata such as EXIF (which may include GPS location) is not copied into the WebP files.",
                ],
            },
            {
                title: "How long we keep it",
                paragraphs: [
                    "Each conversion lives in a temporary folder with a random name. The original image is deleted right after the conversion and the WebP files within 5 minutes. Meanwhile, only someone with the download link can download them.",
                ],
            },
            {
                title: "Cookies",
                paragraphs: ["WEBP Magix uses no cookies and no browser storage; the files you pick only stay in the page's memory until the conversion."],
            },
            {
                title: "Who we share it with",
                paragraphs: ["No one but the hosting provider that runs the service, which may have servers outside Brazil (LGPD art. 33). Data may also be shared when required by law or court order."],
            },
            {
                title: "Your rights",
                paragraphs: [
                    `The LGPD grants you, among others, the rights of confirmation, access, correction, deletion and information about the processing of your data (art. 18). Since files are deleted within minutes, usually none of your data is left. Questions and requests: ${CONTACT}. You can also contact Brazil's National Data Protection Authority (ANPD).`,
                ],
            },
            {
                title: "Changes",
                paragraphs: ["This policy may be updated. The date at the top always shows the version in force."],
            },
        ],
    },
];

export default function Privacy() {
    return (
        <main className="flex flex-col w-full items-center px-4 py-16 gap-10 md:px-52">
            <div className="flex flex-row gap-3">
                {POLICIES.map((p) => (
                    <a key={p.id} href={`#${p.id}`}
                        className="bg-redviolet hover:bg-hoverredviolet rounded-xl px-5 py-2 font-medium">
                        {p.label}
                    </a>
                ))}
            </div>
            {POLICIES.map((p) => (
                <article key={p.id} id={p.id} lang={p.lang}
                    className="flex flex-col gap-6 w-full max-w-3xl bg-babypowder text-richblack rounded-2xl p-8 scroll-mt-6">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl text-titlered font-bold">{p.title}</h1>
                        <p className="text-sm text-redviolet">{p.updated}</p>
                    </div>
                    <p className="leading-relaxed">{p.intro}</p>
                    {p.sections.map((s) => (
                        <section key={s.title} className="flex flex-col gap-2">
                            <h2 className="text-xl font-bold text-redviolet">{s.title}</h2>
                            {s.paragraphs.map((text) => <p key={text} className="leading-relaxed">{text}</p>)}
                        </section>
                    ))}
                </article>
            ))}
            <Link href="/"
                className="text-redviolet bg-turquoise rounded-xl w-60 md:w-80 py-3 text-xl font-medium text-center hover:bg-hoverturquoise">
                Back to the converter
            </Link>
        </main>
    );
}
