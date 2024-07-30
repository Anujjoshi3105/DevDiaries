"use client";

import { NumberTopics } from "@/action/stats";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

const LoadingSkeleton = () => {
  return (
      <div className="flex flex-wrap gap-2 justify-center p-2">
        {[...Array(8)].map((_, index) => (
          <Badge key={index} className="bg-primary/30 h-8 w-20 animate-pulse"></Badge>
        ))}
      </div>
  );
};

export default function Topics() {
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const result = await NumberTopics();
        setTopics(result.topics);
      } catch (error) {
        console.error("Error fetching topics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  return (
    <div>
      <h3 className="text-xl font-bold text-center my-2">TOPICS</h3>
      <div className="flex flex-wrap gap-2 justify-center p-2">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          topics.map((topic) => (
            <Badge key={topic} className="text-sm text-nowrap">
              {topic}
            </Badge>
          ))
        )}
      </div>
    </div>
  );
}
