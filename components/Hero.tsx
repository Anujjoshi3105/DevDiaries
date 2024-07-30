import Image from "next/image"
import Link from "next/link"

export default function Hero() {
  return (
        <section className="w-full py-12">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none mb-6">
                  Discover, Learn, and Innovate
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  A hub for developers offering in-depth tutorials, expert insights, and personal stories. Stay ahead in the tech industry with comprehensive resources and a vibrant community.
                </p>
                </div>
                
              </div>
              <Image
                src="/hero1.webp"
                width={550}
                height={550}
                alt="Hero"
                className="mx-auto my-6 aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                priority
                />
            </div>
          </div>
        </section>
  )
}