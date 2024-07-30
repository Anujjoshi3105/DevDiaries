import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaGlobe, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Page() {
  return (
    <>
      <Header />
      <div className="w-full max-w-5xl mx-auto py-16 px-4 md:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 py-16">
          <div className="flex flex-col items-center justify-center md:items-start text-center md:text-left">
            <div className="rounded-full w-36 h-36 md:w-44 md:h-44 overflow-hidden">
              <Image
                src="/me.jpg"
                alt="Anuj Joshi"
                width={160}
                height={160}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mt-6">Anuj Joshi</h2>
            <p className="text-muted-foreground text-lg md:text-xl">Founder &amp; Developer</p>
            <Link href="mailto:anujoshi3105@gmail.com" className="text-primary hover:underline mt-4" prefetch={false}>
              anujoshi3105@gmail.com
            </Link>
            <div className="flex items-center gap-4 mt-2">
              <Link href="https://twitter.com/anujjoshi3105" target="_blank" className="text-muted-foreground hover:text-primary" prefetch={false}>
                <FaTwitter className="w-5 h-5" />
              </Link>
              <Link href="https://linkedin.com/in/anujjoshi3105" target="_blank" className="text-muted-foreground hover:text-primary" prefetch={false}>
                <FaLinkedin className="w-5 h-5" />
              </Link>
              <Link href="https://github.com/anujjoshi3105" target="_blank" className="text-muted-foreground hover:text-primary" prefetch={false}>
                <FaGithub className="w-5 h-5" />
              </Link>
              <Link href="https://anujjoshi3105.vercel.app" target="_blank" className="text-muted-foreground hover:text-primary" prefetch={false}>
                <FaGlobe className="w-5 h-5" />
              </Link>
              <Link href="https://www.instagram.com/anujjoshi3105/" target="_blank" className="text-muted-foreground hover:text-primary" prefetch={false}>
                <FaInstagram className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center space-y-6">
            <div>
              <h3 className="text-2xl font-bold">About Me</h3>
              <p className="text-muted-foreground mt-2">
                Hi, I&apos;m Anuj Joshi, the founder and developer behind this blog. I&apos;m passionate about creating engaging and
                informative content to help people learn and grow. With over 5 years of experience in web development,
                I&apos;ve built this platform from the ground up to provide a seamless and enjoyable reading experience.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold">My Role</h3>
              <p className="text-muted-foreground mt-2">
                As the sole developer of this blog, I&apos;m responsible for all aspects of the website, from the backend
                infrastructure to the frontend design and user experience. I&apos;m constantly working to improve the platform
                and add new features to better serve our readers.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold">Get in Touch</h3>
              <p className="text-muted-foreground mt-2">
                If you have any questions, feedback, or just want to say hello, feel free to reach out to me at the email
                or social media links provided. I&apos;m always happy to connect with our community and hear your thoughts.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
