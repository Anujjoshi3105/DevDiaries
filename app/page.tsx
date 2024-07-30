import Featured from "@/components/Featured";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Popular from "@/components/Popular";
import Random from "@/components/Random";
import Recent from "@/components/Recent";
import Topics from "@/components/Topics";

export default function page() {
  return (
    <>
    <Header />
    <main className="lg:px-20 md:px-10 px-4 py-16">
        <Hero />
        <Featured />
        <Recent />  
        <div className="flex flex-col lg:flex-row-reverse gap-8 my-12">
          <div className="lg:w-1/3">
            <Topics />
            <Popular />
          </div>
          <div className="lg:w-2/3">
            <Random />
          </div>          
        </div>
      </main>
      <Footer />
    </>
  );
}
