"use client";
import { getCurrentUserId } from "@/action/user";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  blogs: Blog[];
  comments: Comment[];
  likes: Like[];
  saves: Save[];
  topics: Topics;
}

interface Blog {
  id: string;
  title: string;
  content: string;
  // Add other blog properties here
}

interface Comment {
  id: string;
  content: string;
  // Add other comment properties here
}

interface Like {
  id: string;
  // Add other like properties here
}

interface Save {
  id: string;
  // Add other save properties here
}

interface Topics {
  selectedTopics: string[];
}

export default function Page() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);

  
  useEffect(() => {
    const fetchUser = async () => {
      try {       
        const userId = session?.user?.id;
        if (userId) {
          const response = await fetch(`/api/user?userId=${userId}`);
          if (response.ok) {
            const data = await response.json();
            setUser(data);
          } else {
            console.error(`Error fetching user data: ${response.statusText}`);
          }
        } else {
          console.error("No user ID found");
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div>
      <h1>User Profile</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
