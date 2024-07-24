import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Search() {
  return (
    <>
    <Button variant="outline" size="icon" className="md:hidden flex rounded-full hover:text-primary">
        <SearchIcon className="h-[1.2rem] w-[1.2rem]"/>
        <span className="sr-only">Search</span>
        </Button>
        <div className="md:flex hidden relative ml-auto">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
            type="search"
            placeholder="Search..."
            className="p-8 pr-4 py-2 rounded-full"
        />
        <span className="sr-only">Search</span>
    </div>    
    </>
  )
}
